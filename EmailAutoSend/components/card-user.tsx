import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/theme'
import ButtonSendIndividual from './ui/btn-send-individual'

const CardUser = () => {
  const data = {
    "yahir": "yahir@g.com",
    
  }
  return (
    <View style={styles.container}>
      <View>
        <Text>Nombre: Yahir</Text> 
        <Text>Correo: yahir@gmail.com</Text>
      </View>
      <ButtonSendIndividual/>
    </View>
  )
}

export default CardUser

const styles = StyleSheet.create({
  container:{
    elevation:10,
    backgroundColor: Colors.light.background,
    borderRadius: 10,
    padding:10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  }
})