var GameStates = {
  PREGAME: 1,
  INGAME: 2,
  GAMEOVER: 3
};

var InputStates = {
  EMPTY: 1,
  INVALID: 2,
  VALID: 3
}

function reset_game() {
  correct_number = Math.ceil(Math.random() * 100);
  guess_count = 0;
  $("#feedback").hide();
  game_state = GameStates.PREGAME;
  input_state = InputStates.EMPTY;
  $("#guess-value").prop("disabled", false);
  refresh_view();
  $("#guess-value").focus()
}

function evaluate_guess(last_guess){
  if (last_guess == correct_number) {
    game_state = GameStates.GAMEOVER;
    return "BOOM!";
  } else if (last_guess > correct_number) {
    return "That is too high";
  } else if (last_guess < correct_number) {
    return "That is too low";
  }
}

function submit_guess() {
  game_state = GameStates.INGAME;
  var last_guess = $("#guess-value").val();
  console.log(last_guess);
  var response = evaluate_guess(last_guess);
  $("#feedback").show();
  $("#guess-value").val('');
  $("#number").html(last_guess);
  $("#comparison").html(response);
  input_state = InputStates.EMPTY;
  refresh_view();
}

function validate_guess_value(guess_value) {
  if (guess_value == ""){
    input_state = InputStates.EMPTY;
    return false
  } else if (guess_value > 100 || guess_value < 1) {
    input_state = InputStates.INVALID;
    return false;
  } else {
    input_state = InputStates.VALID;
    return true;
  }
}

function refresh_view(){
  if (game_state === GameStates.GAMEOVER) {
    $("#guess-button").prop("disabled", true);
    $("#clear-button").prop("disabled", true);
    $("#guess-value").prop("disabled", true);
  } else {
    $("#guess-value").prop("disabled", false);
    switch (input_state) {
      case InputStates.EMPTY:
        $("#guess-value").removeClass("invalid-input");
        $("#guess-button").prop("disabled", true);
        $("#clear-button").prop("disabled", true);
        break;
      case InputStates.INVALID:
        $("#guess-value").addClass("invalid-input");
        $("#guess-button").prop("disabled", true);
        $("#clear-button").prop("disabled", false);
        break;
      case InputStates.VALID:
        $("#guess-value").removeClass("invalid-input");
        $("#guess-button").prop("disabled", false);
        $("#clear-button").prop("disabled", false);
        break;
    }
  }
}

function set_input_state(guess_value) {
  if (guess_value == "") {
    input_state = InputStates.EMPTY;
  } else if (guess_value > 100 || guess_value < 1) {
    input_state = InputStates.INVALID;
  } else {
    input_state = InputStates.VALID;
  }
}

window.onload=reset_game;

$(document).ready(function() {
  $("#guess-form").on('keyup keypress', function(e) {
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      e.preventDefault();
      if (validate_guess_value($("#guess-value").val())){
        submit_guess();
      }
      return false;
    }
  });

  $("#guess-value").keyup(function(){
    set_input_state($(this).val());
    refresh_view();
  });

  $("#guess-button").click(submit_guess);

  $("#clear-button").click(function() {
    $("#guess-value").val("")
    input_state = InputStates.EMPTY;
    refresh_view();
  });

  $("#reset-button").click(reset_game);
});
