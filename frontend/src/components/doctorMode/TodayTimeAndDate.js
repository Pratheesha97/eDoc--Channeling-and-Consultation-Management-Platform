// START CLOCK SCRIPT

Number.prototype.pad = function (n) {
  for (var r = this.toString(); r.length < n; r = 0 + r);
  return r;
};

function updateClock() {
  var now = new Date();
  var milli = now.getMilliseconds(),
    sec = now.getSeconds(),
    min = now.getMinutes(),
    hou = now.getHours(),
    mo = now.getMonth(),
    dy = now.getDate(),
    yr = now.getFullYear();
  hou = (hou + 24) % 24;
  var mid = "AM";
  if (hou == 0) {
    //At 00 hours we need to show 12 am
    hou = 12;
  } else if (hou > 12) {
    hou = hou % 12;
    mid = "PM";
  }

  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var tags = ["mon", "d", "y", "h", "m", "s", "mid"],
    corr = [months[mo], dy, yr, hou.pad(2), min.pad(2), sec.pad(2), mid];
  for (var i = 0; i < tags.length; i++)
    if (document.getElementById(tags[i]) != null) {
      document.getElementById(tags[i]).firstChild.nodeValue = corr[i];
    }
}

export const initClock = () => {
  updateClock();
};

// END CLOCK SCRIPT
