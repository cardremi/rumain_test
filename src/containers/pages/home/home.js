import React, {useEffect, useState} from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';
import {connectApi} from '../../../config/services/endpoint';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import colors from '../../../utils/colors';
import LoadingModal from '../../../components/molecules/loading';
import SearchInput from '../../../components/molecules/searchInput';
import CardHome from '../../templates/cardHome';
import EmptyList from '../../../components/molecules/empty';
import {ScrollView} from 'react-native-gesture-handler';
import ModalFilter from '../../templates/modalFilter';
import {useNavigation} from '@react-navigation/native';

let newArr = [];
const HomePage = () => {
  const [arrData, setArrData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('A-Z');
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterShow = () => {
    if (showModal) {
      return (
        <ModalFilter
          onBackgroundPress={() => setShowModal(false)}
          stateFilter={stateFilter}
          filterAtoZ={() => {
            setShowModal(false);
            setStateFilter('A-Z');
          }}
          filterZtoA={() => {
            setShowModal(false);
            setStateFilter('Z-A');
          }}
          filterNewest={() => {
            setShowModal(false);
            setStateFilter('newest');
          }}
          filterOldest={() => {
            setShowModal(false);
            setStateFilter('oldest');
          }}
        />
      );
    }
  };

  console.log(arrData);
  const getData = async () => {
    await connectApi
      .get('products', {per_page: 100})
      .then(data => {
        if (data !== null) {
          data.forEach((element, _) => {
            for (var i = 0; i < element.categories.length; i++) {
              if (
                element.categories[i].name === 'Ruma.id' ||
                element.categories[i].id === 118
              ) {
                newArr.push(element);
                setArrData([...newArr]);
              }
            }
            setLoading(false);
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const showLoading = () => {
    if (loading) {
      return <LoadingModal title={'Sedang Memproses...'} />;
    }
  };

  return (
    <View
      style={[
        styles.safeArea,
        {paddingTop: insets.top, paddingBottom: insets.bottom},
      ]}>
      <StatusBar backgroundColor={colors.white} barStyle={'dark-content'} />
      {showLoading()}

      <View style={styles.container}>
        <SearchInput
          placeholder={'Location'}
          onChangeText={item => setSearch(item)}
          settingPress={() => setShowModal(true)}
        />
        {arrData.length !== 0 ? (
          <ScrollView
            contentContainerStyle={styles.scrollView}
            showsVerticalScrollIndicator={false}>
            {arrData
              .filter(({name}) => name.includes(search))
              .sort((a, b) => {
                let nameA = a.name.toLowerCase();
                let nameB = b.name.toLowerCase();
                let dateA = a.date_created.slice(0, 10);
                let dateB = b.date_created.slice(0, 10);
                if (stateFilter === 'A-Z') {
                  if (nameA < nameB) {
                    return -1;
                  }
                  if (nameA > nameB) {
                    return 1;
                  }
                  return 0;
                } else if (stateFilter === 'Z-A') {
                  if (nameA < nameB) {
                    return 1;
                  }
                  if (nameA > nameB) {
                    return -1;
                  }
                  return 0;
                } else if (stateFilter === 'oldest') {
                  if (dateA < dateB) {
                    return -1;
                  }
                  if (dateA > dateB) {
                    return 1;
                  }
                  return 0;
                } else if (stateFilter === 'newest') {
                  if (dateA < dateB) {
                    return 1;
                  }
                  if (dateA > dateB) {
                    return -1;
                  }
                  return 0;
                }
              })
              .map((item, idx) => {
                return (
                  <View key={idx} style={{marginVertical: 20}}>
                    <CardHome
                      title={item?.name}
                      image={item?.images[0]?.src}
                      address={item?.description}
                      onPress={() =>
                        navigation.navigate('DetailOptionPage', {
                          name: item?.name,
                          image: item?.images[0]?.src,
                          address: item?.description,
                          price: item?.price,
                          type: item?.price_html === 'Free' ? 'Free' : 'Buy',
                        })
                      }
                    />
                  </View>
                );
              })}
          </ScrollView>
        ) : (
          <EmptyList />
        )}
      </View>
      {filterShow()}
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingTop: 50,
  },
});
