google.charts.load('current', {'packages':['sankey']});

// TODO: make configurable
const LEVELS = 3;
const DELIMITER = ":";

function drawChart(data) {
  // The counts hold the number of occurrances for each item; an item may
  // be a point (i.e. (a, b)) represented as a string or a value of a
  // point (i.e. a). We cannot infer the count of all values (e.g. b)
  // from the point (e.g. (a, b)) because it is possible for the value to
  // be part of another point (e.g. (c, b)). As such, we have to keep
  // track of them all.
  //
  // The points hold the list of unique points; we need to keep this as
  // an array because the actual points are arrays (JavaScript does not
  // have a tuple type). The pointsAsStrings is a set of all the points
  // we have seen so far, so we keep track of unique points.
  let counts = {};
  let points = [];
  let pointsAsStrings = new Set();

  data.split("\n").forEach(
    function(line) {
      line = line.split(DELIMITER);
      line.unshift("time");
      while (line.length > LEVELS) {
        line.pop();
      }
      while (line.length < LEVELS) {
          line.push(line[line.length - 1] + "*");
      }
      for(let i = 0; i < line.length - 1; ++i) {
        let point = [line[i].trim(), line[i + 1].trim()];
        if (point.some((p) => p == "")) {
          console.warn('Encountered empty point value', {line, point});
          continue;
        }
        if (!(String(point) in counts)) {
          counts[String(point)] = 0
        }
        counts[String(point)] += 1;
        if (!pointsAsStrings.has(String(point))) {
          pointsAsStrings.add(String(point));
          points.push(point);
        }
      }
    });

  let data_points = [];
  points.forEach(function(point) {
    data_points.push([...point, counts[String(point)]]);
  });

  var data = new google.visualization.DataTable();
  data.addColumn('string', 'From');
  data.addColumn('string', 'To');
  data.addColumn('number', 'Weight');
  data.addRows(data_points);
  var chart = new google.visualization.Sankey(
          document.getElementById('sankey_basic'));
  chart.draw(data);
}

$(document).ready(function() {
  $('#generate-btn').on('click', function() {
    drawChart($('#sankey-data').val());
  });
});
