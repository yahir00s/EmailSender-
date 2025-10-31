import { StyleSheet, Text, View, Pressable, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/theme";
import { useUploadJson } from "@/hooks/use-upload-json";

const Add = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const { uploadJson, isLoading, error } = useUploadJson();

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setSelectedFile(file);
        console.log("Archivo seleccionado:", file);
      }
    } catch (error) {
      console.error("Error al seleccionar archivo:", error);
      Alert.alert("Error", "No se pudo seleccionar el archivo");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      Alert.alert("Error", "Por favor selecciona un archivo primero");
      return;
    }

    try {
      const result = await uploadJson(selectedFile.uri);
      
      Alert.alert(
        "Éxito", 
        `Archivo cargado correctamente\nID: ${result.entry?.id}`,
        [
          {
            text: "OK",
            onPress: () => setSelectedFile(null),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudo subir el archivo");
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <View style={styles.content}>
        {/* Área de subida */}
        <Pressable
          style={styles.uploadArea}
          onPress={pickDocument}
          disabled={isLoading}
        >
          <Ionicons
            name="cloud-upload-outline"
            size={64}
            color={Colors.light.primary}
          />
          <Text style={styles.uploadTitle}>Subir archivo JSON</Text>
          <Text style={styles.uploadSubtitle}>
            Toca para seleccionar un archivo
          </Text>
        </Pressable>

        {/* Archivo seleccionado */}
        {selectedFile && (
          <View style={styles.fileCard}>
            <View style={styles.fileInfo}>
              <Ionicons
                name="document-text"
                size={40}
                color={Colors.light.primary}
              />
              <View style={styles.fileDetails}>
                <Text style={styles.fileName} numberOfLines={1}>
                  {selectedFile.name}
                </Text>
                <Text style={styles.fileSize}>
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </Text>
              </View>
              <Pressable onPress={removeFile} style={styles.removeButton}>
                <Ionicons name="close-circle" size={24} color="#e74c3c" />
              </Pressable>
            </View>

            {/* Botón de subir */}
            <Pressable
              style={[
                styles.uploadButton,
                isLoading && styles.uploadButtonDisabled,
              ]}
              onPress={handleUpload}
              disabled={isLoading}
            >
              <Text style={styles.uploadButtonText}>
                {isLoading ? "Subiendo..." : "Subir archivo"}
              </Text>
            </Pressable>
          </View>
        )}

        {/* Error message */}
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color="#e74c3c" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Instrucciones */}
        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>Instrucciones:</Text>
          <Text style={styles.instructionsText}>
            • Solo archivos .json son permitidos
          </Text>
          <Text style={styles.instructionsText}>
            • El archivo debe tener el formato correcto
          </Text>
          <Text style={styles.instructionsText}>
            • Tamaño máximo recomendado: 5 MB
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Add;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  uploadArea: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: Colors.light.primary,
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  fileCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  fileDetails: {
    flex: 1,
    marginLeft: 12,
  },
  fileName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 14,
    color: "#666",
  },
  removeButton: {
    padding: 4,
  },
  uploadButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  uploadButtonDisabled: {
    backgroundColor: "#ccc",
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: "#e74c3c",
    marginLeft: 8,
    flex: 1,
  },
  instructions: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
});