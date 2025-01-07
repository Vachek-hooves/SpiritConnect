import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {usePracticeContext} from '../../store/context';

const PracticeCard = ({item, type, onToggleComplete}) => (
  <TouchableOpacity style={styles.card}>
    <Image source={item.image} style={styles.cardImage} />
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardDescription} numberOfLines={1}>
        {item.text}
      </Text>
    </View>
    <TouchableOpacity
      style={styles.checkButton}
      onPress={() => onToggleComplete(type, item.id)}>
      <View
        style={[
          styles.checkCircle,
          item.isCompleted && styles.checkCircleCompleted,
        ]}>
        {item.isCompleted && <Text style={styles.checkMark}>✓</Text>}
      </View>
    </TouchableOpacity>
  </TouchableOpacity>
);

const SectionHeader = ({title}) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.sectionArrow}>{'>'}</Text>
  </View>
);

const TabMainScreen = () => {
  const {practices, togglePracticeCompletion} = usePracticeContext();
  // console.log(practices);
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Spirit Yoga</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <LinearGradient
            colors={['#8B5CF6', '#EC4899']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.notificationGradient}>
            <Text style={styles.notificationIcon}>🔔</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.createButton}>
        <Text style={styles.createButtonText}>Create new practice</Text>
      </TouchableOpacity>

      <SectionHeader title="Meditations" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.cardsContainer}>
        {practices.meditation.map(item => (
          <PracticeCard
            key={item.id}
            item={item}
            type="meditation"
            onToggleComplete={togglePracticeCompletion}
          />
        ))}
      </ScrollView>

      <SectionHeader title="Yoga" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.cardsContainer}>
        {practices.yoga.map(item => (
          <PracticeCard
            key={item.id}
            item={item}
            type="yoga"
            onToggleComplete={togglePracticeCompletion}
          />
        ))}
      </ScrollView>

      <SectionHeader title="Breath practice" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.cardsContainer}>
        {practices.breathing.map(item => (
          <PracticeCard
            key={item.id}
            item={item}
            type="breathing"
            onToggleComplete={togglePracticeCompletion}
          />
        ))}
      </ScrollView>
    </ScrollView>
  );
};

export default TabMainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#100E1B',
    padding: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  notificationGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    fontSize: 20,
  },
  createButton: {
    backgroundColor: '#00FF7F',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
  },
  createButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  sectionArrow: {
    fontSize: 22,
    // color: '#666',
    fontWeight: 'bold',
    color: '#fff',
  },
  cardsContainer: {
    marginBottom: 30,
  },
  card: {
    width: 280,
    height: 180,
    marginRight: 15,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDescription: {
    color: '#ccc',
    fontSize: 14,
  },
  checkButton: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleCompleted: {
    backgroundColor: '#00FF7F',
    borderColor: '#00FF7F',
  },
  checkMark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
