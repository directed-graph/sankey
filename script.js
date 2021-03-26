google.charts.load('current', {'packages':['sankey']});

function drawChart(data, delimiter=':', unshiftTime=true, levels=2) {
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
  if (unshiftTime) {
    levels += 1;
  }

  data.split('\n').forEach(
    function(line) {
      line = line.split(delimiter);
      if (unshiftTime) {
        line.unshift('time');
      }
      while (line.length > levels) {
        line.pop();
      }
      while (line.length < levels) {
        line.push(line[line.length - 1] + '*');
      }
      for(let i = 0; i < line.length - 1; ++i) {
        let point = [line[i].trim(), line[i + 1].trim()];
        if (point.some((p) => p == '')) {
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

  console.log('Processed data', {pointsAsStrings, points, counts, data_points});

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
  if (typeof(Storage) !== 'undefined') {
    $('#sankey-data').val(localStorage.getItem('sankey-data') || '');
    $('#levels').val(localStorage.getItem('levels') || 2);
    $('#unshiftTime').prop('checked',
                           localStorage.getItem('unshiftTime') || false);

    $('#save-btn').bind('click', function() {
      localStorage.setItem('sankey-data', $('#sankey-data').val());
      localStorage.setItem('levels', $('#levels').val());
      localStorage.setItem('unshiftTime', $('#unshiftTime').is(':checked'));
    });
  }
  $('#generate-btn').on('click', function() {
    drawChart($('#sankey-data').val(), delimiter=':',
              unshiftTime=$('#unshiftTime').is(':checked') || false,
              levels=Number.parseInt($('#levels').val()) || 2);
  });
});
