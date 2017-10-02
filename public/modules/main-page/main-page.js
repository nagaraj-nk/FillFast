var authUser;
var LOGOUT = 1;
var action;


$(document).ready(function() {
    $(".button-collapse").sideNav();
    $('.modal').modal();
})

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        authUser = user;
        $('#name').text(user.displayName);
        $('#email').text(user.email);
        $('#photo').attr('src', user.photoURL);
    } else {
        window.location.href = "../../index.html";
    }
});

function signOut() {
    firebase.auth().signOut();
}

function send() {
    var messageObj = {};

    messageObj.message = $('#message').val();
    messageObj.sender = authUser.displayName;
    messageObj.photoURL = authUser.photoURL;

    var messageRef = firebase.database().ref('messages').push();
    messageRef.set(messageObj);
}

var usersRef = firebase.database().ref('users');


usersRef.on('child_added', function(data) {
    addUserElement(data.key, data.val());
});

var selectedPlayer = undefined;

function addUserElement(key, data) {
    var element = '<li class="collection-item valign-wrapper" onclick="onPlayerClicked(\'' + key + '\')">' +
        '<img src= "' + data.photoURL + '" alt= "" class="circle" width="30" height="30" />' +
        '<span class="title" style="margin-left:10px">' + data.displayName + '</span>' +
        '</li>';
    $('#collection').prepend(element);
    if (selectedPlayer == undefined) {
        onPlayerClicked(key);
    }
}

function onPlayerClicked(key) {
    usersRef.child(key).once('value', function(data) {
        selectedPlayer = data.val();
        $('#profile_image').attr('src', selectedPlayer.photoURL);
        $('#selected_player_name').text(selectedPlayer.displayName);
        $('#selected_player_email').text(selectedPlayer.email);
    });
}

function logout() {
    action = LOGOUT;
    var modalObj = {
        message: 'Do you want to logout?',
        title: 'Confirm logout'
    };
    showConfirmModal(modalObj);
}

function showConfirmModal(modalObj) {
    $('#confirm_modal').modal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: .5, // Opacity of modal background
        inDuration: 300, // Transition in duration
        outDuration: 200, // Transition out duration
        startingTop: '4%', // Starting top style attribute
        endingTop: '10%', // Ending top style attribute
        ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
            console.log(modal, trigger);
            $('#confirm_title').text(modalObj.title);
            $('#confirm_message').text(modalObj.message);
        },
        complete: function() {

        }
    });
    $('#confirm_modal').modal('open');
}

function onConfirmed() {
    switch (action) {
        case LOGOUT:
            {
                firebase.auth().signOut();
                break;
            }
    }
}