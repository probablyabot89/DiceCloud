<template>
  <div>
    <v-card class="ma-4">
      <v-list v-if="CreaturesWithNoParty.length">
        <v-list-tile
          v-for="character in CreaturesWithNoParty"
          :key="character._id"
          :to="character.url"
        >
          <v-list-tile-avatar :color="character.color">
            <img
              v-if="character.picture"
              :src="character.picture"
              alt="character.name"
            >
            <template v-else>
              {{ character.initial }}
            </template>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ character.name }}
            </v-list-tile-title>
            <v-list-tile-sub-title>
              {{ character.alignment }} {{ character.gender }} {{ character.race }}
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-expansion-panel popout>
        <v-expansion-panel-content
          v-for="party in parties"
          :key="party._id"
        >
          <div slot="header">
            {{ party.name }}
          </div>
          <v-card>
            <v-list>
              <v-list-tile
                v-for="character in party.characterDocs"
                :key="character._id"
              >
                <v-list-tile-avatar>
                  <img
                    :src="character.picture"
                    alt="character.name"
                  >
                </v-list-tile-avatar>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-card>
    <v-speed-dial
      v-model="fab"
      fixed
      bottom
      right
      transition="slide-y-reverse-transition"
    >
      <v-btn
        slot="activator"
        v-model="fab"
        color="accent"
        fab
      >
        <v-icon>add</v-icon>
        <v-icon>close</v-icon>
      </v-btn>
      <labeled-fab
        icon="face"
        label="New Character"
        @click="insertCharacter"
      />
      <labeled-fab
        icon="group"
        label="New Party"
      />
    </v-speed-dial>
  </div>
</template>

<script>
  import Creatures, {insertCreature} from '/imports/api/creature/Creatures.js';
  import Parties from '/imports/api/campaign/Parties.js';
  import LabeledFab from '/imports/ui/components/LabeledFab.vue';

  const characterTransform = function(char){
    char.url = `/character/${char._id}/${char.urlName || '-'}`;
    char.initial = char.name && char.name[0] || '?';
    return char;
  };
  export default {
    components: {
      LabeledFab,
    },
    data(){ return{
      fab: false,
    }},
    meteor: {
      $subscribe: {
        'characterList': [],
      },
      parties(){
        const userId = Meteor.userId();
        let parties =  Parties.find(
          {owner: userId},
          {sort: {name: 1}},
        ).map(party => {
          party.characterDocs = Creatures.find(
            {
              _id: {$in: party.Creatures},
              $or: [{readers: userId}, {writers: userId}, {owner: userId}],
            }, {
              sort: {name: 1},
            }
          ).map(characterTransform);
          return party;
        });
        return parties;
      },
      CreaturesWithNoParty() {
        var userId = Meteor.userId();
        var charArrays = Parties.find({owner: userId}).map(p => p.Creatures);
        var partyChars = _.uniq(_.flatten(charArrays));
        return Creatures.find(
          {
            _id: {$nin: partyChars},
            $or: [{readers: userId}, {writers: userId}, {owner: userId}],
          },
          {sort: {name: 1}}
        ).map(characterTransform);
      },
    },
    methods: {
      insertCharacter(){
        insertCreature.call((error, result) => {
          if (error){
            console.error(error);
          } else {
            this.$router.push({ path: `/character/${result}`})
          }
        });

        /*
        store.commit("pushDialogStack", {
           component: CharacterCreationDialog,
           data: {},
           element: undefined,
           returnElement: undefined,
           callback(result){
             if (!result) return;
             insertCreature.call(result);
           },
        });
        */
      },
    }
  };
</script>
