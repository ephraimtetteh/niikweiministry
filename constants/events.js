import Event1 from '@/public/events/flyer1.jpg'
import Event2 from '@/public/events/flyer4.jpg'
import Event3 from '@/public/events/event3.png'
import HopeInvasion from '@/public/events/hopeInvasion.jpg'
import MTN from '@/public/events/mtnStands.jpg'
import FOG2 from '@/public/events/FoG2.jpg'


export const events = [
    {
        image: FOG2, 
        title: "Fountain of Glory 2.0", 
        description: "A live worship recording gathering", 
        venue: "Liberty Hall, Fountain head christain university college, Tema", 
        time: "9:00am", 
        date: { 
            day: "22", 
            month: "November", 
            year: "2025"
        }
    },
]


export const Pastevents = [
    {
        image: Event2, 
        title: "The Rock Of My Life", 
        description: "Join our live streaming service on youtube", 
        venue: "All Digital Platform", 
        time: "To Be Determined", date: 
        {day: "14", month: "Febraury", year: "2025"}
    },
    {
        image: Event1, 
        title: "Judah Experience", 
        description: "Join our powerful worship and ministry to be blessed", 
        venue: "Fountain of Glory, Accra, Ghana", 
        time: "10:00 AM", date: {day: "06", month: "March", year: "2025"}
    },
    {
        image: HopeInvasion, 
        title: "Hope Invasion", 
        description: "A youth program fostering growth through education, and personal development ", 
        venue: "Arm Forces Senior Technical School", 
        time: "4:30AM", date: {day: "15", month: "June", year: "2025"}
    },
    {
        image: MTN, 
        title: "MTN Stands In Worship", 
        description: "An Events organized by MTN Ghana that brough christians together to worship ", 
        venue: "Grand Arena", 
        time: "4:30AM", date: {day: "15", month: "June", year: "2025"}
    },
]