// DISCLAIMER
// this function comes from old Breeze application. I fixed only TSLint issues and replaced
// jQuery/lodash uses with pure JavaScript code

const applyStepping = (minutes, stepping) => {
  return Math.ceil((minutes / stepping)) * stepping;
};

export const parseMinutes = (inputText, stepping) => {
  if (typeof stepping === 'undefined') {
    stepping = 15;
  }

  if (typeof inputText === 'undefined' || inputText === null) {
    return null;
  }

  if (typeof inputText === 'number') {
    return applyStepping(inputText, stepping);
  }

  inputText = inputText.trim().replace(/\s/, '');
  if (inputText.length === 0) {
    return null;
  }

  if (inputText.match(/(\d+)[hH](\d+)([mM]|$)/)) {
    inputText = String(inputText);
    inputText = inputText.replace('h', ':');
    inputText = inputText.replace('hour', ':');
    inputText = inputText.replace('H', ':');
    inputText = inputText.replace('m', '');
    inputText = inputText.replace('min', '');
    inputText = inputText.replace('M', '');
  }

  const VALID_TIME_STRING =
    /^[0-9]{0,7}[:,.]?[0-9]{0,2}(M|m|min|mins|minute|minutes|H|h|hr|hrs|hour|hours|D|d|day|days)?$/;

  if (!inputText.match(VALID_TIME_STRING)) {
    return null;
  }
  if (!/[0-9]/.test(inputText)) {
    return null;
  }
  let factor;
  let minutes;

  if (inputText.match(/:/)) {

    minutes = applyStepping(
      parseInt(inputText.split(':')[0] || 0, 10) * 60 +
      (parseInt(inputText.split(':')[1].replace(/^0/, ''), 10) || 0),
      stepping);

    return minutes;
  }
  if (inputText.match(/(M|m|min|mins|minute|minutes)$/)) {
    factor = 1;
  }
  if (inputText.match(/(H|h|hr|hrs|hour|hours)$/)) {
    factor = 60;
  }
  if (inputText.match(/(D|d|day|days)$/)) {
    factor = 60 * 8;
  }

  minutes = parseInt(inputText.replace(/[,\.].*$/, '').replace(/[^0-9]/, ''), 10) || 0;
  if (!factor && minutes < 10) {
    factor = 60;
  }

  const re = inputText.match(
    /[,\.]([0-9]|[0-9][0-9])(M|m|min|mins|minute|minutes|H|h|hr|hrs|hour|hours|D|d|day|days)?$/
  );

  if (re) {
    const f = parseInt(re[1], 10);
    minutes = minutes * factor + (Math.round(factor * (re[1].length > 1 ? f / 100 : f / 10)));
    factor = 1;
  }

  minutes *= (factor || 1);
  minutes = applyStepping(minutes, stepping);

  return minutes;
};
