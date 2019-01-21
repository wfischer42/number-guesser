// Creating enumerable to keep track of the state of the game. Not sure if this
// is a good way to do it. Just trying stuff.
var GameStates = {
  PREGAME: 1,
  INGAME: 2,
  GAMEOVER: 3
};

// Same as above, but for keeping track of the guess input field
var InputStates = {
  EMPTY: 1,
  INVALID: 2,
  VALID: 3
}

// Function that starts a fresh game on page load or reset.
function reset_game() {
  // Start by setting default global min and max
  min = 1;
  max = 100;
  // Set the actual number as a function of the max (also as global)
  correct_number = Math.ceil(Math.random() * max);
  // Add html to blocks that prompt player to choose between min and max
  $("#min").html(min)
  $("#max").html(max)
  // Add values to the fields for updating the max
  $("#min-value").val(min)
  $("#max-value").val(max)
  // Set initial gamestate to pregame (global)
  game_state = GameStates.PREGAME;
  // Set initial input state to empty (global)
  input_state = InputStates.EMPTY;
  $("#guess-value").prop("disabled", false);
  // Make sure 'guess value' input field is empty
  $("#guess-value").val("");
  // call function that changes display properties based on states
  refresh_view();
  // Focus on the guess value input field
  $("#guess-value").focus();
}

// Checks guess against correct number and returns a display string
function evaluate_guess(last_guess){
  if (last_guess == correct_number) {
    // Correct guess sets to 'gameover'
    game_state = GameStates.GAMEOVER;
    // Increments the max R
    max += 10;
    // Resets the correct number for the next game
    correct_number = Math.ceil(Math.random() * max);
    // returns display string
    return "BOOM! Try a harder one...";
  } else if (last_guess > correct_number) {
    // self explanatory
    return "That is too high";
  } else if (last_guess < correct_number) {
    return "That is too low";
  }
}

function submit_guess() {
  // Set game state when guess is made
  game_state = GameStates.INGAME;
  // sets "last-guess" to value of input field
  var last_guess = $("#guess-value").val();
  console.log(last_guess);
  // call function that evaluates the guess against correct_number,
  // Set return value to response for use later
  var response = evaluate_guess(last_guess);
  // display #feedback block
  $("#feedback").show();
  // clear guess value input
  $("#guess-value").val('');
  // display guess as html inside #number element
  $("#number").html(last_guess);
  // Display response text as html inside #comparison element
  $("#comparison").html(response);
  // Set inpuyt state back to empty
  input_state = InputStates.EMPTY;
  refresh_view();
}

// Make sure guess value is in range before allowing submission
// Returns true for valid, false for invalid
function validate_guess_value(guess_value) {
  // Convert string guess_value to integer for comparisons
  guess_value = parseInt(guess_value);
  // "" is converted to NaN
  if (isNaN(guess_value)){
    input_state = InputStates.EMPTY;
    return false
  } else if (guess_value > max || guess_value < min) {
    // Set input state to invalid if out of range
    input_state = InputStates.INVALID;
    return false;
  } else {
    // Set input state to invalid if out of range
    input_state = InputStates.VALID;
    return true;
  }
}

function refresh_view(){
  if (game_state === GameStates.GAMEOVER) {
    // Update the displayed max if game has ended
    $("#max").html(max);
  } else if (game_state === GameStates.PREGAME) {
    // Show field to change max (settings) before games.
    $("#prompt").hide();
    $("#settings").show();
  } else if (game_state === GameStates.INGAME) {
    // Hide settings element and show range prompt durring game
    $("#prompt").show();
    $("#settings").hide();
  }
  switch (input_state) {
    case InputStates.EMPTY:
      // Don't allow submit or clear if field is empty
      $("#guess-value").removeClass("invalid-input");
      $("#guess-button").prop("disabled", true);
      $("#clear-button").prop("disabled", true);
      break;
    case InputStates.INVALID:
      // Allow clear and add "invalid input" class if input is invalid
      $("#guess-value").addClass("invalid-input");
      $("#guess-button").prop("disabled", true);
      $("#clear-button").prop("disabled", false);
      break;
    case InputStates.VALID:
      // allow clear and guess if input is valid, and remove "invalid input" class
      $("#guess-value").removeClass("invalid-input");
      $("#guess-button").prop("disabled", false);
      $("#clear-button").prop("disabled", false);
      break;
    // Switching over enumerable and covering all possibilities, so "default:" isn't necessary
  }
}

function set_input_state(guess_value) {
  // Parse the string guess_value to integer for comparison
  // Mostly redundant method. Should remove to DRY up.
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
  // Parse new_max string to integer
  new_max = parseInt(new_max);
  // Clear guess input if max is changed before game starts
  $("#guess-value").val("");
  input_state = InputStates.EMPTY;
  if (new_max > min) {
    // Don't update the max if it's less than the min (not well handled)
    max = new_max;
    // Display new max in prompt if it's updated
    $("#max").html(max);
    // Change the correct number if max is updated
    correct_number = Math.ceil(Math.random() * max);
  }
  refresh_view();
}

window.onload=reset_game;

// after document loads, execute anonymous function
$(document).ready(function() {
  // Update max whenever someone types in the box
  $("#max-value").keyup(function(){
    update_max($(this).val());
  });

  // Custom response to keypress or keyup action in the guess-form
  $("#guess-form").on('keyup keypress', function(e) {
    // event.keyCode is technically depricated, but works in older browsers. e.keycode and e.which in this case will return the ascii value of the key pressed, and this covers pretty much all browsers.
    var keyCode = e.keyCode || e.which;
    // 13 represents is the enter button
    if (keyCode === 13) {
      // Override form submission when enter is pressed
      e.preventDefault();
      // Instead, validate the guess
      if (validate_guess_value($("#guess-value").val())){
        // and submit it if valid
        submit_guess();
      }
      return false;
    }
  });

  // Override enter button for max value input also.
  $("#max-value").on('keyup keypress', function(e) {
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      // On enter, just focus on the guess input field. (max is already updated)
      e.preventDefault();
      $("#guess-value").focus();
      return false;
    }
  });

  // When any key is pressed, update the max value
  $("#guess-value").keyup(function(){
    set_input_state($(this).val());
    refresh_view();
  });

  // Call submit guess fuction when the button is clicked (same as enter)
  $("#guess-button").click(submit_guess);

  // When clear button is clicked...
  $("#clear-button").click(function() {
    // Clear the guess input field
    $("#guess-value").val("")
    // Set the state to empty
    input_state = InputStates.EMPTY;
    // refresh the view
    refresh_view();
    // and focus on the empty input field
    $("#guess-value").focus();
  });

  // On reset, call reset_game function
  $("#reset-button").click(reset_game);
});
