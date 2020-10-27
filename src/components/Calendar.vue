<template>
<div > 
  <v-row>
    <v-toolbar  dark class="indigo d-flex justify-center align-center ">
      <v-toolbar-title class="headline text-uppercase d-flex flex-row align-center">
        <v-icon large class="mr-10">
              mdi-calendar-month
        </v-icon> 
        <p class="mb-0">CALENDAR APP</p>
        <v-icon large class="ml-10">
              mdi-calendar-month
        </v-icon> 
      </v-toolbar-title>
      <v-spacer></v-spacer>
      
    </v-toolbar>
  </v-row>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar
          flat
        >
          <v-btn
            color="primary"
            class="mr-4"
            @click="dialog=true"
            dark
          >
            New Event
          </v-btn>
          <v-btn
            outlined
            class="mr-4"
            color="grey darken-2"
            @click="setToday"
          >
            Today
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="prev"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="next"
          >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu
            bottom
            right
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                outlined
                color="grey darken-2"
                v-bind="attrs"
                v-on="on"
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>

    <v-dialog v-model="dialog" max-width="500">
    <v-card>
    <v-container>
    <v-form @submit.prevent="addEvent">
    <v-text-field v-model="names" type="text" label="event name(required)" ></v-text-field>
    <v-text-field v-model="details" type="text" label="details" ></v-text-field>
    <v-text-field v-model="start" type="date" label="start (required)" ></v-text-field>
    <v-text-field v-model="end" type="date" label="end (required)" ></v-text-field>
    <v-text-field v-model="colors" type="color" label="color (click to open color menu)"></v-text-field>
    <v-btn type="submit"
    color="primary"
    class="mr-4"
    @click.stop="dialog=false">
    Add Event
    </v-btn>

    </v-form>
    </v-container>
    </v-card>
    </v-dialog>


      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="getEvents"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card
            color="grey lighten-4"
            min-width="350px"
            flat
          >
            <v-toolbar
              :color="selectedEvent.color"
              dark
            >
              <v-btn @click="deleteEvent(selectedEvent.id)" icon>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
             
            </v-toolbar>
            <v-card-text>
              <form v-if='currentlyEditing !== selectedEvent.id'>
              {{selectedEvent.details}}
              </form>
              <form v-else>
              <textarea-autosize v-model="selectedEvent.details" type="text" style="width:100%" :min-heightt="100" placeholder="Add Note">
              </textarea-autosize>
              </form>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                color="secondary"
                @click="selectedOpen = false"
              >
                Close
              </v-btn>
              
              <v-btn
                text
                v-if="currentlyEditing !== selectedEvent.id"
                @click.prevent="editEvent(selectedEvent)"
              >
                Edit
              </v-btn>
              <v-btn
                text
                v-else
                @click.prevent="updateEvent(selectedEvent)"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row></div>
</template>

<script>
import {db} from '@/main'

  export default {
   data: ()=> ({
        today: new Date().toISOString().substr(0,10),
        focus: new Date().toISOString().substr(0,10),
        type:'month',
        typeToLabel: {
            month: 'Month',
            week: 'Week',
            day:'Day',
            '4day': '4 Days'
        },
        names:[''],
        details:null,
        start:null,
        end:null,
        colors:['#356782'],
        currentlyEditing:null,
        selectedEvent:{},
        selectedElement:null,
        selectedOpen:false,
        events:[],
        dialog:false,
    }),
    mounted () {
      this.$refs.calendar.checkChange()
      this.getEvents()
    },
    methods: {
         async getEvents() {
             let snapshot= await db.collection('calendarEvent').get()
            let events=[]
            snapshot.forEach(doc => {
                 let appData=doc.data()
                appData.id=doc.id
                 events.push(appData)
             });
            this.events=events

         },
      viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
      },
      getEventColor (event) {
        return event.color
      },
      setToday () {
        this.focus = ''
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          setTimeout(() => {
            this.selectedOpen = true
          }, 10)
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },
      rnd (a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },
      editEvent(ev){
          this.currentlyEditing=ev.id
      },
      async updateEvent(ev) {
          await db.collection('calendarEvent').doc(this.currentlyEditing).update({
              details: ev.details
          })
          this.selectedOpen=false
          this.currentlyEditing=null
      },
      async deleteEvent(ev){
          await db.collection('calendarEvent').doc(ev).delete()
          this.selectedOpen=false
          this.getEvents()
      },
      async addEvent(){
          if(this.names && this.start && this.end){
              db.collection('calendarEvent').add({
                  name:this.names,
                  details:this.details,
                  start:this.start,
                  end:this.end,
                  color:this.colors
              })
              this.getEvents()
              this.names=''
              this.details=''
              this.start=''
              this.end=''
              this.colors=''

          }
          else {
              alert('Name,Start Date and End Date are required')
          }

      }
    },
  }
</script>

<style>

</style>