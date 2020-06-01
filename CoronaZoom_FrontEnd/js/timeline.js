// With JQuery
//$("#timeline").slider({
//  step: 20000,
//  min: 0,
//  max: 200000,
//  ticks: [0, 100, 200, 300, 400],
//  ticks_labels: ['$0', '$100', '$200', '$300', '$400'],
//  ticks_snap_bounds: 30
//});

// Without JQuery
var slider = new Slider("#timeline", {
  step: 100,
	min: 0,
	max: 400
  //ticks: [0, 100, 200, 300, 400],
  //ticks_labels: ['$0', '$100', '$200', '$300', '$400'],
  //ticks_snap_bounds: 30
});

// 범위 지정
//var sliderA = new Slider("#ex16a", { min: 0, max: 10, value: 0, focus: true });
//var sliderB = new Slider("#ex16b", { min: 0, max: 10, value: [0, 10], focus: true });
