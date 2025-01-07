import { createContext, useState, useContext, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { meditation, yoga, breathing } from '../data/cards'

export const PracticeContext = createContext({})

export const PracticeProvider = ({children}) => {
    const [practices, setPractices] = useState({
        meditation: [],
        yoga: [],
        breathing: []
    })
    const [moodNotes, setMoodNotes] = useState([])
    // console.log(moodNotes)

    const initializeData = async () => {
        try {
            // Try to get saved practices
            const savedMeditation = await AsyncStorage.getItem('meditation')
            const savedYoga = await AsyncStorage.getItem('yoga')
            const savedBreathing = await AsyncStorage.getItem('breathing')

            // If no saved data, use initial data from cards.js
            if (!savedMeditation) {
                await AsyncStorage.setItem('meditation', JSON.stringify(meditation))
            }
            if (!savedYoga) {
                await AsyncStorage.setItem('yoga', JSON.stringify(yoga))
            }
            if (!savedBreathing) {
                await AsyncStorage.setItem('breathing', JSON.stringify(breathing))
            }

            // Set the practices state
            setPractices({
                meditation: savedMeditation ? JSON.parse(savedMeditation) : meditation,
                yoga: savedYoga ? JSON.parse(savedYoga) : yoga,
                breathing: savedBreathing ? JSON.parse(savedBreathing) : breathing
            })
        } catch (error) {
            console.error('Error initializing data:', error)
        }
    }

    const addMoodNote = async (newMoodNote) => {
        try {
            const updatedMoodNotes = [...moodNotes, newMoodNote]
            await AsyncStorage.setItem('moodNotes', JSON.stringify(updatedMoodNotes))
            setMoodNotes(updatedMoodNotes)
        } catch (error) {
            console.error('Error adding mood note:', error)
        }
    }

    // Initialize mood notes from AsyncStorage
    const initializeMoodNotes = async () => {
        try {
            const savedMoodNotes = await AsyncStorage.getItem('moodNotes')
            if (savedMoodNotes) {
                setMoodNotes(JSON.parse(savedMoodNotes))
            }
        } catch (error) {
            console.error('Error initializing mood notes:', error)
        }
    }

    const deleteMoodNote = async (date) => {
        try {
            const updatedMoodNotes = moodNotes.filter(note => note.date !== date);
            await AsyncStorage.setItem('moodNotes', JSON.stringify(updatedMoodNotes));
            setMoodNotes(updatedMoodNotes);
        } catch (error) {
            console.error('Error deleting mood note:', error);
        }
    };

    // Call initialize functions in useEffect
    useEffect(() => {
        initializeData()
        initializeMoodNotes()
    }, [])

    const togglePracticeCompletion = async (type, id) => {
        try {
            const updatedPractices = {
                ...practices,
                [type]: practices[type].map(practice => 
                    practice.id === id 
                        ? {...practice, isCompleted: !practice.isCompleted}
                        : practice
                )
            }
            await AsyncStorage.setItem(type, JSON.stringify(updatedPractices[type]))
            setPractices(updatedPractices)
        } catch (error) {
            console.error('Error updating practice:', error)
        }
    }

     // New function to mark a practice as completed
     const completePractice = async (type, id) => {
        try {
            const updatedPractices = {
                ...practices,
                [type]: practices[type].map(practice => 
                    practice.id === id 
                        ? { ...practice, isCompleted: true }
                        : practice
                )
            };
            await AsyncStorage.setItem(type, JSON.stringify(updatedPractices[type]));
            setPractices(updatedPractices);
        } catch (error) {
            console.error('Error completing practice:', error);
        }
    };

    return (
        <PracticeContext.Provider 
            value={{
                practices,
                togglePracticeCompletion,
                completePractice,
                addMoodNote,
                moodNotes,
                deleteMoodNote
            }}
        >
            {children}
        </PracticeContext.Provider>
    )
}

export const usePracticeContext = () => useContext(PracticeContext)