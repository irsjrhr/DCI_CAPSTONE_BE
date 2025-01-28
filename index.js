const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use( cors() );


var data_dbRoom = [
// { id: "1",name : "Room Contoh", description : "No", capacity: getRandomInt(1, 109)},
];
var data_dbBooking = [
// { id: "1",name : "Booking Contoh", contact:"08961245236", id_room:"2", date : "2021-02-01"},
]

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function generateUniqueId() {
  const timestamp = Date.now(); // Mendapatkan timestamp saat ini
  const randomNum = Math.floor(Math.random() * 1000000); // Angka acak 6 digit
  return `id-${timestamp}-${randomNum}`;
}

function get_roomId( id_room ) {
  var result = null;
  for (var i = 0; i < data_dbRoom.length; i++) {
    var data_row = data_dbRoom[i];
    if( data_row.id == id_room ) {
      result = data_row
      break;
    }
  }
  return result;
}
function tambah_data_room( input_row_room ) {

  var data_row_room = { 
    id: generateUniqueId(),
    name : input_row_room.name, 
    description: input_row_room.description , 
    capacity: input_row_room.capacity, 
  }

  data_dbRoom.push( data_row_room );
  return {
    status : true
  };
}

function update_data_room( id_room, input_row_room ) {


  var data_row_roomUpdate = { 
    id: id_room,
    name : input_row_room.name, 
    description: input_row_room.description , 
    capacity: input_row_room.capacity, 
  }

  //Cari index data room berdasarkan id roomnya
  var index_data = false;
  for (var i = 0; i < data_dbRoom.length; i++) {
    var data_row = data_dbRoom[i];
    if( data_row.id == id_room ) {
      index_data = i
      break;
    }
  }

  //Update data rownya
  var response = {};
  if ( index_data != false  ) {
    data_dbRoom[index_data] = data_row_roomUpdate;
    response.status = true;
  }else{
    response.status = false;
    response.id_room = id_room;
    response.msg = "Data room tidak ditemukan!"
  }

  return response;
}

function hapus_data_room( id_room ) {

  //Cari index data arrat bebrdasarkan id room
  var index_data = false;
  for (var i = 0; i < data_dbRoom.length; i++) {
    var data_row_room = data_dbRoom[i];
    if ( data_row_room.id == id_room ) {
      index_data = i;
      break;
    }
  }

  //Hapus data rownya
  var response = {};
  if ( index_data != false  ) {
    data_dbRoom.splice(index_data, 1);
    response.status = true;
  }else{
    response.status = false;
    response.id_room = id_room;
    response.msg = "Data room tidak ditemukan!"
  }

  console.log( response );
  return response;
}





function get_bookingId( id_booking ) {
  var result = null;
  for (var i = 0; i < data_dbBooking.length; i++) {
    var data_row = data_dbBooking[i];
    if( data_row.id == id_booking ) {
      result = data_row
      break;
    }
  }
  return result;
}


function tambah_data_booking( input_row_booking ) {
  var data_row_booking = { 
    id: generateUniqueId(),
    name : input_row_booking.name, 
    contact: input_row_booking.contact , 
    id_room: input_row_booking.id_room, 
    date : input_row_booking.date
  }

  data_dbBooking.push( data_row_booking );
  return {
    status : true
  };
}


// +++++++++++ BOOKING ROUTE ROOMS ++++++++++
app.get("/rooms", async function(req, res) {

  res.json({
    status : "success",
    data : data_dbRoom
  }).status(200);
})

app.get("/rooms/:id", async function(req, res) {

  var param = req.params;
  var id_room = param.id;

  res.json({
    status : "success",
    data : get_roomId( id_room )

  }).status(200);
})

app.post('/rooms', async function(req, res) {


  var input_row_room = req.body;
  var tambah_room = tambah_data_room( input_row_room );

  var response = {
    status : "success", 
    message : "Room created successfully",
    data : input_row_room
  }

  res.json(response).status(200);

})

app.put('/rooms/:id', async function(req, res) {

  var param = req.params;
  var id_room = param.id;
  var input_row_room = req.body;

  var update_room = update_data_room( id_room, input_row_room );


  var response = {
    status : "success", 
    message : "room updated successfully",
    data : input_row_room
  }

  res.json(response).status(200);

})


app.delete('/rooms/:id', async function(req, res) {

  var param = req.params;
  var id_room = param.id;
  var hapus_room = hapus_data_room( id_room );

  var response = {
    status : "success", 
    message : "room deleted successfully",
  }

  res.json(response).status(200);

})



// +++++++++++ BOOKING ROUTE BOOKINGS ++++++++++

app.get("/bookings", async function(req, res) {
  res.json({
    status : "success",
    data : data_dbBooking
  }).status(200);
})

app.get("/bookings/:id", async function(req, res) {

  var param = req.params;
  var id_booking = param.id;

  res.json({
    status : "success",
    data : get_bookingId( id_booking  )
  }).status(200);
})
app.post('/bookings', async function(req, res) {

  var input_row_booking = req.body;
  var tambah_booking = tambah_data_booking( input_row_booking );

  var response = {
    status : "success", 
    message : "Booking created successfully",
    data : input_row_booking
  }

  res.json(response).status(200);

})


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
