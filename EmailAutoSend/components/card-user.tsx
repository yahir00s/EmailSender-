import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React from "react";
import { Colors } from "@/constants/theme";
import ButtonSendIndividual from "./ui/btn-send-individual";
import { useFetchData } from "@/hooks/use-fetch-data";
import ButtonSendToAll from "./ui/btn-send-to-all";
import { useUsers } from "@/context/UsersContext";
import AvatarCircle from "./ui/avatar-circle";
import { useFocusEffect } from "expo-router";
import SearchBar from "./ui/search-bar";

interface User {
  name: string;
  email: string;
}

interface CardUserProps {
  searchQuery?: string;
  onSearchChange?: (text: string) => void;
}

const CardUser = ({ searchQuery = "", onSearchChange }: CardUserProps) => {
  const { data, isLoading, error, refetch, hasMore, loadMore, isLoadingMore, isOffline } =
    useFetchData({
      limit: 8,
    });
  const { refreshTrigger } = useUsers();

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  React.useEffect(() => {
    if (refreshTrigger > 0) {
      refetch();
    }
  }, [refreshTrigger, refetch]);

  const users: User[] = React.useMemo(() => {
    if (!data?.items || data.items.length === 0) return [];

    const allUsers: User[] = [];
    data.items.forEach((item) => {
      Object.entries(item.data).forEach(([name, email]) => {
        allUsers.push({
          name: name.charAt(0).toUpperCase() + name.slice(1), 
          email,
        });
      });
    });

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      return allUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }

    return allUsers;
  }, [data?.items, searchQuery]);

  const handleSendSuccess = (name: string) => {
    console.log(`Correo enviado correctamente a ${name}`);
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        {onSearchChange && (
          <SearchBar value={searchQuery} onChangeText={onSearchChange} />
        )}
        {isOffline && (!data?.items || data.items.length!== 0) && (
          <View style={styles.offlineBanner}>
            <Text style={styles.offlineText}>
              No tienes conexión
            </Text>
          </View>
        )}
        <ButtonSendToAll />
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <Text style={styles.loadingText}>Cargando usuarios...</Text>
      </View>
    );
  }

  const hasDataButEmpty =
    data && data.success && (!data.items || data.items.length === 0);

  if (error && !hasDataButEmpty) {
    return (
      <View style={styles.centerContainer}>
        {renderHeader()}
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: User }) => {
    const data = { [item.name]: item.email };

    return (
      <View style={styles.userRow}>
        <AvatarCircle name={item.name} />
        <View style={[styles.userInfo, styles.userInfoWithAvatar]}>
          <Text style={styles.nameText}>Nombre: {item.name}</Text>
          <Text style={styles.emailText}>Correo: {item.email}</Text>
        </View>
        <ButtonSendIndividual
          data={data}
          onSuccess={() => handleSendSuccess(item.name)}
        />
      </View>
    );
  };

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={Colors.light.primary} />
        <Text style={styles.footerText}>Cargando más usuarios...</Text>
      </View>
    );
  };

  if (users.length === 0) {
    return (
      <>
      {renderHeader()}
      <FlatList
        data={[]}
        keyExtractor={() => "empty"}
        renderItem={() => null}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        // ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aún no has agregado usuarios</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
          refreshing={isLoading}
          onRefresh={refetch}
          colors={[Colors.light.primary]}
          />
        }
        />
        </>
    );
  }

  return (
    <>
      {renderHeader()}
      <FlatList
        data={users}
        keyExtractor={(item, index) => `${item.email}-${index}`}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        onEndReached={hasMore ? loadMore : undefined}
        onEndReachedThreshold={0.5}
        // ListHeaderComponent={renderHeader}
        ListFooterComponent={isLoadingMore ? renderFooter : null}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            colors={[Colors.light.primary]}
          />
        }
      />
    </>
  );
};

export default CardUser;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
  },
  header: {
    marginBottom: 0,
  },
  offlineBanner: {
    backgroundColor: "#ffa500",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  offlineText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  userRow: {
    borderWidth: 1,
    borderColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.light.background,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 17,
    marginBottom: 10,
  },
  userInfo: {
    flex: 1,
  },
  userInfoWithAvatar: {
    marginLeft: 12,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  emailText: {
    fontSize: 14,
    color: "#666",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#e74c3c",
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  footer: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  footerText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
});
