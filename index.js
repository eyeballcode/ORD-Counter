let leaveUsed = [ // 0.5 - Half Day, 1.0 - Full Day
  {
    day: dayjs('22 Feb 2022'),
    duration: 1.0,
    title: 'A Level Results Collection'
  },
  {
    day: dayjs('04 Mar 2022'),
    duration: 1.0,
    title: 'BMTC 01/22 POP'
  },
  {
    day: dayjs('06 June 2022'),
    duration: 5.0,
    title: 'BMTC 02/22 POP Block Leave'
  },
  {
    day: dayjs('08 Aug 2022'),
    duration: 1.0,
    title: 'SCS FT 53/22 Block Leave'
  },
  {
    day: dayjs('05 Dec 2022'),
    duration: 1.0,
    title: 'BMTC 04/22 Family Day'
  },
  {
    day: dayjs('27 Aug 2022'),
    duration: 4.0,
    title: 'ANNUAL LEAVE CLEARING'
  }
]

let offAccumulated = [
  {
    day: dayjs('26 Nov 2022'),
    duration: 3,
    title: 'COMD BMTC - 04/22 POP OFF'
  },
  {
    day: dayjs('26 Dec 2022'),
    duration: 1,
    title: 'COS - CHRISTMAS'
  },
  {
    day: dayjs('28 Dec 2022'),
    duration: 2,
    title: 'LEAVE REFUNDED - C COY BTP'
  },
  {
    day: dayjs('31 Dec 2022'),
    duration: 1,
    title: 'COS - NEW YEARS EVE'
  },
  {
    day: dayjs('2 Jan 2022'),
    duration: 1,
    title: 'COS - NEW YEARS DAY OBSERVED'
  }
]

let offUsed = [
  {
    day: dayjs('9 Jan 2023'),
    duration: 2.0
  }, {
    day: dayjs('13 Jan 2023'),
    duration: 1.0
  }, {
    day: dayjs('20 Jan 2023'),
    duration: 1.0
  }, {
    day: dayjs('6 Mar 2023'),
    duration: 1.0
  }, {
    day: dayjs('10 Mar 2023'),
    duration: 1.0
  }
]

leaveUsed.forEach(leave => { leave.year = leave.day.get('year') })

let now = dayjs().startOf('day')
let enlistment = dayjs('08 Feb 2022')
let popDay = dayjs('04 June 2022')
let scsPostingDay = dayjs('13 Jun 2022')
let scsGPDay = dayjs('17 Nov 2022')
let ordDay = dayjs('07 Feb 2024')

let nextPayDay
if (now.get('date') <= 10) nextPayDay = now.startOf('month').add(9, 'days')
else nextPayDay = now.startOf('month').add(1, 'month').add(9, 'days')
if ([0, 6].includes(nextPayDay.get('day'))) nextPayDay = nextPayDay.add(-1, 'day').set('day', 5)

let lastPayDay = nextPayDay.startOf('month').add(-1, 'month').add(9, 'days')
if ([0, 6].includes(lastPayDay.get('day'))) lastPayDay = lastPayDay.add(-1, 'day').set('day', 5)

if (nextPayDay < now) {
  lastPayDay = nextPayDay
  nextPayDay = now.startOf('month').add(1, 'month').add(9, 'days')
}

let endOfYear = now.endOf('year')
let startOfWorkYear = dayjs(Math.max(+now.startOf('year'), +enlistment))

let daysToPOP = popDay.diff(now, 'days')
let daysToSCSGP = scsGPDay.diff(now, 'days')
let daysToORD = ordDay.diff(now, 'days')
let daysToPay = nextPayDay.diff(now, 'days')

let daysFromLastPay = now.diff(lastPayDay, 'days')

let bmtLength = popDay.diff(enlistment, 'days') + 1
let scsLength = scsGPDay.diff(scsPostingDay, 'days') + 1
let serviceLength = ordDay.diff(enlistment, 'days') + 1
let yearLength = endOfYear.diff(startOfWorkYear, 'days') + 1

let leaveEntitled = Math.round(14 * yearLength / 365)
let thisYear = now.get('year')
let thisYearLeave = leaveUsed.filter(leave => leave.year === thisYear)
let thisYearClocked = thisYearLeave.reduce((acc, leave) => acc + leave.duration, 0)
let totalLeaveClocked = leaveUsed.reduce((acc, leave) => acc + leave.duration, 0)

let offDaysGiven = offAccumulated.reduce((acc, off) => acc + off.duration, 0)
let offDaysUsed = offUsed.reduce((acc, off) => acc + off.duration, 0)

let daysToEndOfWeek = 0
let thisFriday = now.startOf('isoWeek').set('day', 5)
let nextMonday = now.startOf('isoWeek').add(1, 'week')
if (thisFriday >= now) daysToEndOfWeek = thisFriday.diff(now, 'days') + 1
let ordWeekMonday = ordDay.startOf('week').add(1, 'day')
let numberOfWeeks = ordWeekMonday.diff(nextMonday, 'weeks')
let ordWeekDays = ordDay.diff(ordWeekMonday, 'days') + 1

let workingDays = daysToEndOfWeek + numberOfWeeks * 5 + ordWeekDays - 28 + totalLeaveClocked

function initHomePage() {
  if (daysToPOP < 0) {
    document.querySelector('#pop-counter > span.main-number').textContent = -daysToPOP
    document.querySelector('#pop-counter > span.main-number').setAttribute('data-days', -daysToPOP)
    document.querySelector('#pop-counter > span.caption > span.to-since').textContent = 'since'
    document.querySelector('#pop-counter').className = `c100 p100 blue`
  } else {
    document.querySelector('#pop-counter > span.main-number').textContent = daysToPOP
    document.querySelector('#pop-counter > span.main-number').setAttribute('data-days', daysToPOP)
    document.querySelector('#pop-counter').className = `c100 p${Math.round(100 - 100 * (daysToPOP / bmtLength))} blue`
  }

  if (daysToSCSGP < 0) {
    document.querySelector('#scs-gp-counter > span.main-number').textContent = -daysToSCSGP
    document.querySelector('#scs-gp-counter > span.main-number').setAttribute('data-days', -daysToSCSGP)
    document.querySelector('#scs-gp-counter > span.caption > span.to-since').textContent = 'since'
    document.querySelector('#scs-gp-counter').className = `c100 p100 purple`
  } else {
    document.querySelector('#scs-gp-counter > span.main-number').textContent = daysToSCSGP
    document.querySelector('#scs-gp-counter > span.main-number').setAttribute('data-days', daysToSCSGP)
    document.querySelector('#scs-gp-counter').className = `c100 p${Math.round(100 - 100 * (daysToSCSGP / scsLength))} purple`
  }

  if (daysToORD < 0) {
    document.querySelector('#ord-counter > span.main-number').textContent = -daysToORD
    document.querySelector('#ord-counter > span.main-number').setAttribute('data-days', -daysToORD)
    document.querySelector('#ord-counter > span.caption > span.to-since').textContent = 'since'
    document.querySelector('#ord-counter > span.subcaption > span#working-days').textContent = '0'
    document.querySelector('#ord-counter').className = `c100 p100 pink`
  } else {
    document.querySelector('#ord-counter > span.main-number').textContent = daysToORD
    document.querySelector('#ord-counter > span.main-number').setAttribute('data-days', daysToORD)
    document.querySelector('#ord-counter > span.subcaption > span#working-days').textContent = workingDays
    document.querySelector('#ord-counter > span.subcaption > span#working-days').setAttribute('data-days', workingDays)
    document.querySelector('#ord-counter').className = `c100 p${Math.round(100 - 100 * (daysToORD / serviceLength))} pink`
  }

  document.querySelector('#pay-counter > span.main-number').textContent = daysToPay
  document.querySelector('#pay-counter > span.main-number').setAttribute('data-days', daysToPay)

  document.querySelector('#leave-counter > span.main-number').textContent = `${leaveEntitled - thisYearClocked}/${leaveEntitled}`
  document.querySelector('#leave-counter > span.main-number').setAttribute('data-days', leaveEntitled - thisYearClocked)

  document.querySelector('#off-counter > span.main-number').textContent = `${offDaysGiven - offDaysUsed}/${offDaysGiven}`
  document.querySelector('#off-counter > span.main-number').setAttribute('data-days', offDaysGiven - offDaysUsed)

  document.querySelector('#pay-counter').className = `c100 p${Math.round(100 - 100 * (daysToPay / (daysFromLastPay + daysToPay)))} orange`

  document.querySelector('#leave-counter').className = `c100 p${Math.round(100 * (thisYearClocked / leaveEntitled))} yellow`
  document.querySelector('#off-counter').className = `c100 p${Math.round(100 * (offDaysUsed / offDaysGiven))} yellow`
}

function initLeavePage() {
  let html = thisYearLeave.map(leave => {
    let duration
    if (leave.duration === 0.5) duration = 'Half Day'
    else if (leave.duration === 1) duration = 'Full Day'
    else duration = `${leave.duration} Days`

    return `<h2>${leave.title} (${leave.day.format('DD MMM YYYY')})</h2>
<p>Duration: ${duration}</p>`
  }).join('')

  document.getElementById('leave-content').innerHTML = html
  document.getElementById('leave-overview').textContent = `Leave Remaining: ${leaveEntitled - thisYearClocked}/${leaveEntitled} Days`
}

function initOffPage() {
  let html = offAccumulated.map(off => {
    return `<h2>${off.title} (${off.day.format('DD MMM YYYY')})</h2>
<p>Duration: ${off.duration} Day${off.duration === 1 ? '' : 's'}</p>`
  }).join('')

  document.getElementById('off-content').innerHTML = html
  document.getElementById('off-overview').textContent = `Off Remaining: ${offDaysGiven - offDaysUsed}/${offDaysGiven} Days`
}

if (location.pathname === '/') {
  initHomePage()
  setInterval(initHomePage, 1000)
} else if (location.pathname === '/leave.html') {
  initLeavePage()
} else if (location.pathname === '/off.html') {
  initOffPage()
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(registration => {
    console.log('Service Worker Registered')
  })

  navigator.serviceWorker.ready.then(registration => {
    console.log('Service Worker Ready')
  })
}
