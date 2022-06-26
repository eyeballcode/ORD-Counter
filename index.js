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
  }
]

leaveUsed.forEach(leave => { leave.year = leave.day.get('year') })

let now = dayjs().startOf('day')
let enlistment = dayjs('08 Feb 2022')
let popDay = dayjs('04 June 2022')
let scsPostingDay = dayjs('13 Jun 2022')
let scsGPDay = dayjs('18 Nov 2022')
let ordDay = dayjs('07 Feb 2024')

let nextPayDay
if (now.get('date') <= 10) nextPayDay = dayjs().startOf('month').add(9, 'days')
else nextPayDay = dayjs().startOf('month').add(1, 'month').add(9, 'days')
let lastPayDay = nextPayDay.add(-1, 'month')

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

function initHomePage() {
  if (daysToPOP < 0) {
    document.querySelector('#pop-counter > span.main-number').textContent = -daysToPOP
    document.querySelector('#pop-counter > span.caption').textContent = 'Days since POP'
    document.querySelector('#pop-counter').className = `c100 p100 blue`
  } else {
    document.querySelector('#pop-counter > span.main-number').textContent = daysToPOP
    document.querySelector('#pop-counter').className = `c100 p${Math.round(100 - 100 * (daysToPOP / bmtLength))} blue`
  }

  if (daysToSCSGP < 0) {
    document.querySelector('#scs-gp-counter > span.main-number').textContent = -daysToSCSGP
    document.querySelector('#scs-gp-counter > span.caption').textContent = 'Days since GP'
    document.querySelector('#scs-gp-counter').className = `c100 p100 purple`
  } else {
    document.querySelector('#scs-gp-counter > span.main-number').textContent = daysToSCSGP
    document.querySelector('#scs-gp-counter').className = `c100 p${Math.round(100 - 100 * (daysToSCSGP / scsLength))} purple`
  }

  if (daysToORD < 0) {
    document.querySelector('#ord-counter > span.main-number').textContent = -daysToORD
    document.querySelector('#ord-counter > span.caption').textContent = 'Days since ORD'
    document.querySelector('#ord-counter').className = `c100 p100 pink`
  } else {
    document.querySelector('#ord-counter > span.main-number').textContent = daysToORD
    document.querySelector('#ord-counter').className = `c100 p${Math.round(100 - 100 * (daysToORD / serviceLength))} pink`
  }

  document.querySelector('#pay-counter > span.main-number').textContent = daysToPay
  document.querySelector('#leave-counter > span.main-number').textContent = `${leaveEntitled - thisYearClocked}/${leaveEntitled}`

  document.querySelector('#pay-counter').className = `c100 p${Math.round(100 * (daysToPay / (daysFromLastPay + daysToPay)))} orange`
  document.querySelector('#leave-counter').className = `c100 p${Math.round(100 * (thisYearClocked / leaveEntitled))} yellow`
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

if (location.pathname === '/') {
  initHomePage()
  setInterval(initHomePage, 1000)
} else if (location.pathname === '/leave.html') {
  initLeavePage()
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(registration => {
    console.log('Service Worker Registered')
  })

  navigator.serviceWorker.ready.then(registration => {
    console.log('Service Worker Ready')
  })
}
