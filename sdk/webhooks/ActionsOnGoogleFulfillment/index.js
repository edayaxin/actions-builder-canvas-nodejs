/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const {
  conversation,
  Canvas,
} = require('@assistant/conversation');

// const {
//   actionssdk,
//   Permission,
//   Suggestions,
//   DateTime,
//   Place,
//   Confirmation,
// } = require('actions-on-google');

const functions = require('firebase-functions');

const INSTRUCTIONS = 'Do you want me to change color or pause spinning?';

const CANVAS_URL = 'https://test-canvas-2-54e3b.web.app';

const tints = {
  black: 0x000000,
  blue: 0x0000FF,
  green: 0x00FF00,
  cyan: 0x00FFFF,
  indigo: 0x4B0082,
  magenta: 0x6A0DAD,
  maroon: 0x800000,
  grey: 0x808080,
  brown: 0xA52A2A,
  violet: 0xEE82EE,
  red: 0xFF0000,
  purple: 0xFF00FF,
  orange: 0xFFA500,
  pink: 0xFFC0CB,
  yellow: 0xFFFF00,
  white: 0xFFFFFF,
};

var questions = [
  "Do you want to take the health survey now?",
  "please measure your blood pressure. There are two values, what is the larger one?",
  "I heard your input is 115. Is it correct?",
  "Great, what is the smaller number?",
  "I heard your input is 75. Correct?",
  "Next, let's talk about how well you slept last night. Is it very good, good, fair, poor, or very poor?",
  "I heard you said good. Is it right?",
  "How are you feeling about your pain today? Is it no pain, mild, moderate, severe, or very severe?",
  "I heard it's moderate. Correct?",
  "You are all set! Do you want to view the weekly summary?",
  "This is your weekly summary. Continue?",
  "Do you want to send the surve summary to your doctor?",
  "Ok, the survey summary has been sent succesfully. Elder Tree will exit in 5 seconds.",
];

const app = conversation({debug: true });
// const app_actionsdk = actionssdk({debug: true});


var background_idx = 0;

app.handle('welcome', (conv) => {
  if (!conv.device.capabilities.includes('INTERACTIVE_CANVAS')) {
    conv.add('Sorry, this device does not support Interactive Canvas!');
    conv.scene.next.name = 'actions.page.END_CONVERSATION';
    return;
  }

  // conv.ask(new Confirmation('Do you want to take the health survey now?'));
  conv.add('Do you want to take the health survey now?');
  background_idx = 0;
  conv.add(new Canvas({
    // Update this placeholder string with the URL for your canvas web app.
    url: CANVAS_URL,
  }));
});

app.handle('fallback', (conv) => {
  conv.add(`I don't understand.`);
  conv.add(new Canvas());
});

app.handle('input_no', (conv) => {
  conv.add(`Sorry, I don't understand.`);
  conv.add(new Canvas({
    data: {
      command: 'YES_NO',
      next: false,
      background_idx: background_idx,
    },
  }));
});

app.handle('survey_input', (conv) => {
  // conv.ask(new Confirmation('Can you confirm?'));
  background_idx = background_idx + 1;
  conv.add(questions[background_idx]);

  conv.add(new Canvas({
    data: {
      command: 'YES_NO',
      next: true,
      background_idx: background_idx,
    },
  }));
});

// app.handle('actions.intent.CONFIRMATION', (conv, confirmationGranted) => {
//   // conv.ask(confirmationGranted
//   //   ? 'Thank you for confirming'
//   //   : 'Sorry, could you tell me the result again?');
//   //
//   //   if (confirmationGranted) {
//   //     background_idx = background_idx + 1;
//   //   }
//
//     background_idx = background_idx + 1;
//     conv.add(new Canvas({
//       data: {
//         command: 'YES_NO',
//         next: confirmationGranted,
//         background_idx: background_idx,
//       },
//     }));
// });


app.handle('input_yes', (conv) => {
  // conv.add(`Your input is confirmed, we will continue.`);
  background_idx = background_idx + 1;
  conv.add(questions[background_idx]);

  conv.add(new Canvas({
    data: {
      command: 'YES_NO',
      next: true,
      background_idx: background_idx,
    },
  }));
});

app.handle('confirm_task', (conv) => {
  // conv.add(`Your input is confirmed, we will continue.`);
  background_idx = background_idx + 1;
  conv.add(questions[background_idx]);

  conv.add(new Canvas({
    data: {
      command: 'SURVEY_START',
      background_idx: background_idx,
    },
  }));
});

app.handle('start_survey', (conv) => {
  // conv.add(`Ok, let's start the survey. Please measure your blood pressure. What is the result?`);
  background_idx = background_idx + 1;
  conv.add(questions[background_idx]);

  conv.add(new Canvas({
    data: {
      command: 'SURVEY_START',
      background_idx: background_idx,
    },
  }));
});

//
// app.handle('change_color', (conv) => {
//   const color =
//     conv.intent.params.color? conv.intent.params.color.resolved : null;
//   if (!(color in tints)) {
//     conv.add(`Sorry, I don't know that color. Try red, blue, or green!`);
//     conv.add(new Canvas());
//     return;
//   }
//   conv.add(`Ok, I changed my color to ${color}. What else?`);
//     conv.add(new Canvas({
//       data: {
//         command: 'TINT',
//         tint: tints[color],
//       },
//     }));
// });
//
// app.handle('start_spin', (conv) => {
//   conv.add(`Ok, I'm spinning. What else?`);
//   conv.add(new Canvas({
//     data: {
//       command: 'SPIN',
//       spin: true,
//     },
//   }));
// });
//
// app.handle('stop_spin', (conv) => {
//   conv.add('Ok, I paused spinning. What else?');
//   conv.add(new Canvas({
//     data: {
//       command: 'SPIN',
//       spin: false,
//     },
//   }));
// });
//
// app.handle('instructions', (conv) => {
//   conv.add(INSTRUCTIONS);
//   conv.add(new Canvas());
// });
//
// app.handle('restart', (conv) => {
//   conv.add(INSTRUCTIONS);
//   conv.add(new Canvas({
//     data: {
//       command: 'RESTART_GAME',
//     },
//   }));
// });

// exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app);
// exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app_actionsdk);

exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app);
