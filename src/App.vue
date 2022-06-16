<template>
  <div>
    <!-- <div class="card-item-plus">
        <div>
            <input 
            v-model="newCard"
            required
            placeholder="Add Card"
            @keyup.enter="add"
            >
            <button @click="add" class="card-item-plus-btn">Add a card</button>
        </div>
    </div> -->

    <draggable id="main" :list="columns" group="columns" :move="checkMove">
      <div class="column-row" v-for="column in columns" :key="column.id">
        <div class="column-list">
          <div class="list-header">
            <h3 class="list-header-title">{{ column.name }}</h3>
            <div class="column-edit-icons">
              <i
                class="column-edit-icon"
                v-on:click="editColumnicon(column.id, column.name)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="feather feather-edit"
                >
                  <path
                    d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                  ></path>
                  <path
                    d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                  ></path>
                </svg>
              </i>
              <i
                class="column-remove-icon"
                v-on:click="removeColumnicon(column.id)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="feather feather-delete"
                >
                  <path
                    d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"
                  ></path>
                  <line x1="18" y1="9" x2="12" y2="15"></line>
                  <line x1="12" y1="9" x2="18" y2="15"></line>
                </svg>
              </i>
            </div>
          </div>
          <div
            class="column-wrapper"
            v-if="editColumnClicked && editId == column.id"
          >
            <input
              class="edit-name-input"
              v-model="updateColumn"
              required
              placeholder="Enter list title"
              @keyup.enter="editcolumn"
            />
          </div>

          <!-- Card draggable component. -->
          <draggable class="list-card" :list="cards" group="cards">
            <div
              class="list-card-item"
              v-for="card in cards.filter(
                (card) => card.column_id === column.id
              )"
              :key="card.name"
            >
              {{ card.name }}
            </div>
          </draggable>

          <div class="card-item-plus">
            <div @click="showModal = true" class="card-item-plus-btn">
              Add a card
            </div>
          </div>
        </div>
      </div>

      <div class="column-row">
        <div class="column-list">
          <div class="open-add-list" @click="createColumn">
            <h3 class="list-header">Add another list</h3>
          </div>
          <div class="column-wrapper" v-if="createColumnClicked">
            <input
              class="list-name-input"
              v-model="newColumn"
              required
              placeholder="Enter list title"
              @keyup.enter="addcolumn"
            />
          </div>
        </div>
      </div>
    </draggable>
    <modal :show="showModal" @close="showModal = false">
      <template #header>
        <input
          class="list-card-title"
          v-model="newCardTitle"
          required
          placeholder="Enter list title"
        />
      </template>
      <template #body>
        <textarea
          class="list-card-body"
          v-model="newCardBody"
          placeholder="Enter list description"
          rows="4"
        >
        </textarea>
      </template>
      <template #footer>
        <button
          class="modal-default-button"
          @click="$emit('close')"
          @keyup.enter="addcard"
        >
          Submit
        </button>
      </template>
    </modal>
  </div>
</template>

<script>
//import draggable
import draggable from "vuedraggable";
import axios from "axios";
import Modal from "./components/Modal.vue";

export default {
  name: "kanban-board",
  components: {
    //import draggable as a component
    draggable,
    Modal,
  },
  data() {
    return {
      // for new cards
      newCard: "",
      newColumn: "",
      newCardTitle: "",
      newCardBody: "",
      columns: [],
      cards: [],
      // 4 arrays to keep track of our 4 statuses

      createColumnClicked: false,
      editColumnClicked: false,
      showModal: false,
    };
  },
  created() {
    axios.get(`http://localhost:8000/api/columns`).then((res) => {
      this.columns = JSON.parse(res.data.columns);
    });
    axios.get(`http://localhost:8000/api/cards`).then((res) => {
      this.cards = JSON.parse(res.data.cards);
    });
  },

  methods: {
    //add new cards method
    add: function () {
      if (this.newCard) {
        this.cards.push({ name: this.newCard });
        this.newCard = "";
      }
    },
    checkMove: function (evt) {
      axios
        .post("http://localhost:8000/api/columns/orderchange", {
          firstId: evt.draggedContext.element.id,
          targetId: evt.relatedContext.element.id,
        })
        .then((res) => console.log(res));
      return evt.draggedContext.element.name !== "apple";
    },

    addcolumn: function () {
      if (this.newColumn) {
        axios
          .post("http://localhost:8000/api/columns", { name: this.newColumn })
          .then(
            (response) => (
              this.columns.push({ name: this.newColumn, id: response.data.id }),
              (this.newColumn = "")
            )
          )
          .catch((err) => console.log(err))
          .finally(() => (this.loading = false));
      }
    },
    editcolumn: function () {
      if (this.updateColumn) {
        axios
          .patch(`http://localhost:8000/api/columns/${this.editId}`, {
            name: this.updateColumn,
          })
          .then((res) => {
            this.columns = JSON.parse(res.data.columns);
          });
        this.editColumnClicked = false;
      }
    },

    createColumn() {
      this.createColumnClicked = true;
    },
    editColumnicon(id, name) {
      this.editColumnClicked = true;
      this.updateColumn = name;
      this.editId = id;
    },

    removeColumnicon(id) {
      axios
        .delete(`http://localhost:8000/api/columns/${id}`)
        .then((response) => {
          console.log(response.data);
          let i = this.columns.map((data) => data.id).indexOf(id);
          this.columns.splice(i, 1);
        });
    },

    // CARD
    addcard: function () {
      console.log("sdfsdfsdf");
      if (this.newCardTitle && this.newCardBody) {
        axios
          .post("http://localhost:8000/api/cards", {
            name: this.newCardTitle,
            description: this.newCardBody,
          })
          .then(
            (response) => (
              this.columns.push({
                name: this.newCardTitle,
                description: this.newCardBody,
                id: response.data.id,
              }),
              (this.newCardTitle = ""),
              (this.newCardBody = "")
            )
          )
          .catch((err) => console.log(err))
          .finally(() => (this.loading = false));
      }
    },
  },
};
</script>

<style>
body {
  background: url("./assets/background.jpg");
  background-position: 50%;
  background-size: cover;
}

#main {
  bottom: 0;
  left: 0;
  margin-bottom: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 8px;
  position: absolute;
  right: 0;
  top: 50px;
  -webkit-user-select: none;
  user-select: none;
  white-space: nowrap;
}

.column-row {
  box-sizing: border-box;
  display: inline-block;
  height: 100%;
  margin: 0 4px;
  vertical-align: top;
  white-space: nowrap;
  width: 272px;
  margin-left: 12px;
}

.column-list {
  background-color: #ebecf0;
  border-radius: 3px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  position: relative;
  white-space: normal;
  width: 100% !important;
}

.list-header {
  flex: 0 0 auto;
  min-height: 20px;
  padding: 10px 8px;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-card {
  flex: 1 1 auto;
  margin: 0 4px;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0 4px;
  z-index: 1;
}

.list-card-item {
  background-color: #fff;
  border-radius: 3px;
  box-shadow: 0 1px 0 #091e4240;
  cursor: pointer;
  display: flex;
  margin-bottom: 8px;
  max-width: 300px;
  min-height: 30px;
  position: relative;
  text-decoration: none;
  z-index: 0;
  align-items: center;
}

.card-item-plus-btn {
  border-radius: 3px;
  color: #5e6c84;
  display: block;
  flex: 1 0 auto;
  margin: 2px 8px 8px 8px;
  padding: 4px 8px;
  position: relative;
  text-decoration: none;
  -webkit-user-select: none;
  user-select: none;
  cursor: pointer;
}

.card-item-plus-btn:hover {
  background-color: #091e4214;
  color: #172b4d;
}

.open-add-list {
  color: #172b4d;
  background-color: initial;
  cursor: pointer;
}

.column-edit-icon {
  cursor: pointer;
}

.column-remove-icon {
  cursor: pointer;
  margin-left: 10px;
}

.column-wrapper {
  margin: 0 10px 5px 10px;
}

.column-wrapper > input {
  background-color: #fff;
  box-shadow: inset 0 0 0 2px #0079bf;
  display: block;
  margin: 0;
  transition: margin 85ms ease-in, background 85ms ease-in;
  width: 100%;

  -webkit-appearance: none;
  background-color: #fafbfc;
  border: none;
  border-radius: 3px;
  box-shadow: inset 0 0 0 2px #dfe1e6;
  box-sizing: border-box;
  display: block;
  line-height: 20px;
  margin-bottom: 12px;
  outline: none;
  padding: 8px 12px;
  transition-duration: 85ms;
  transition-timing-function: ease;

  color: #172b4d;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Noto Sans,
    Ubuntu, Droid Sans, Helvetica Neue, sans-serif;
  font-size: 14px;
  font-weight: 400;
}
</style>
