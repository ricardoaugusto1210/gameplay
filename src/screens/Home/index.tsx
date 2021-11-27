import React, { useState, useCallback } from 'react';
import { View, FlatList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { CategorySelect } from '../../components/CategorySelect';
import { Appointment, AppointmentProps } from '../../components/Appointment';
import { ListDevider } from '../../components/ListDevider';
import { ListHeader } from '../../components/ListHeader';
import { Background } from '../../components/Background';
import { ButtonAdd } from '../../components/ButtonAdd';
import { Profile } from '../../components/Profile';
import { Load } from '../../components/Load';

import { styles } from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLLECTION_APPOINTMENTS } from '../../configs/database';


export function Home() {
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<AppointmentProps[]>([]);
  
  const navigation = useNavigation();



  function handleCategorySelect(categoryId: string) {
    categoryId === category ? setCategory('') : setCategory(categoryId);

    // if(categoryId === category){
    //   setCategory('')
    // } else{
    //     setCategory(categoryId)
    // }
  }

  function handleAppointmentDetails(guildSelect: AppointmentProps) {
    navigation.navigate('AppointmentDetails', { guildSelect })
  }
  function handleAppointmentCreate() {
    navigation.navigate("AppointmentCreate")
  }

  async function loadAppointments() {
    const response = await AsyncStorage.getItem(COLLECTION_APPOINTMENTS)
    const storage: AppointmentProps[] = response ? JSON.parse(response) : [];

    if(category){
      setAppointments(storage.filter(item => item.category === category))
    }else{
      setAppointments(storage)
    }

    setLoading(false)
  }

  useFocusEffect(useCallback(() => {
    loadAppointments();
  },[category]))

  

  return(
    <Background>
      <View style={styles.header}>
        <Profile />
        <ButtonAdd onPress={handleAppointmentCreate}/>
      </View>

      <CategorySelect
        categorySelected={category}
        setCategory={handleCategorySelect}    
      />
      {
        loading ? <Load /> :
        <>
          <ListHeader 
            title="Partidas agendadas"
            subtitle={`Total ${appointments.length}`}
          />
      
          <FlatList
            data={appointments}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <Appointment 
                data={item} 
                onPress={() => handleAppointmentDetails(item)}
              />
            )}
            ItemSeparatorComponent={() => <ListDevider />}
            contentContainerStyle={{ paddingBottom: 69 }}
            style={styles.matches}
            showsVerticalScrollIndicator={false}  
          />
        </>
      }
    </Background>
  );
}