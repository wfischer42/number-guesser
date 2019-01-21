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
  min = 1;
  max = 100;
  correct_number = Math.ceil(Math.random() * max);
  $("#min").html(min)
  $("#max").html(max)
  $("#max-value").val(max)
  game_state = GameStates.PREGAME;
  input_state = InputStates.EMPTY;
  $("#feedback").hide();
  $("#guess-value").val("");
  refresh_view();
  $("#guess-value").focus();
}

function evaluate_guess(last_guess){
  if (last_guess == correct_number) {
    game_state = GameStates.GAMEOVER;
    max += 10;
    correct_number = Math.ceil(Math.random() * max);
    return "BOOM! Try a harder one...";
  } else if (last_guess > correct_number) {
    return "That is too high";
  } else if (last_guess < correct_number) {
    return "That is too low";
  }
}

function submit_guess() {
  game_state = GameStates.INGAME;
  var last_guess = $("#guess-value").val();
  var response = evaluate_guess(last_guess);
  $("#feedback").show();
  $("#guess-value").val('');
  $("#number").html(last_guess);
  $("#comparison").html(response);
  input_state = InputStates.EMPTY;
  refresh_view();
}

function validate_guess_value(guess_value) {
  guess_value = parseInt(guess_value);
  if (isNaN(guess_value)){
    input_state = InputStates.EMPTY;
    return false
  } else if (guess_value > max || guess_value < min) {
    input_state = InputStates.INVALID;
    return false;
  } else {
    input_state = InputStates.VALID;
    return true;
  }
}

function refresh_view(){
  if (game_state === GameStates.GAMEOVER) {
    $("#max").html(max);
  } else if (game_state === GameStates.PREGAME) {
    $("#prompt").hide();
    $("#settings").show();
  } else if (game_state === GameStates.INGAME) {
    $("#prompt").show();
    $("#settings").hide();
  }
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

function set_input_state(guess_value) {
  guess_value = parseInt(guess_value);
  if (isNaN(guess_value)) {
    input_state = InputStates.EMPTY;
  } else if (guess_value > max || guess_value < min) {
    input_state = InputStates.INVALID;
  } else {
    input_state = InputStates.VALID;
  }
}

function update_max(new_max) {
  new_max = parseInt(new_max);

  $("#guess-value").val("");
  input_state = InputStates.EMPTY;
  if (new_max > min) {
    max = new_max;
    $("#max").html(max);
    correct_number = Math.ceil(Math.random() * max);
  }
  refresh_view();
}

$(document).ready(function() {
  $("#max-value").keyup(function(){
    update_max($(this).val());
  });

  $("#guess-form").on('keyup keypress', function(e) {
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      e.preventDefault();
      if (validate_guess_value($("#guess-value").val())){
        submit_guess();
      }
    }
  });

  $("#max-value").on('keyup keypress', function(e) {
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      e.preventDefault();
      $("#guess-value").focus();
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
    $("#guess-value").focus();
  });

  $("#reset-button").click(reset_game);
});

window.onload=reset_game;
