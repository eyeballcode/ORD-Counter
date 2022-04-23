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
  }
]

leaveUsed.forEach(leave => { leave.year = leave.day.get('year') })

let now = dayjs()
let enlistment = dayjs('08 Feb 2022')
let popDay = dayjs('03 June 2022')
let ordDay = dayjs('07 Feb 2024')
let nextPayDay = dayjs().startOf('month').add(1, 'month').add(9, 'days')
let lastPayDay = dayjs().startOf('month').add(9, 'days')
let endOfYear = now.endOf('year')
let startOfWorkYear = dayjs(Math.max(+now.startOf('year'), +enlistment))

let daysToPOP = popDay.diff(now, 'days') + 1
let daysToORD = ordDay.diff(now, 'days') + 1
let daysToPay = nextPayDay.diff(now, 'days') + 1

let daysFromLastPay = now.diff(lastPayDay, 'days')

let bmtLength = popDay.diff(enlistment, 'days') + 1
let serviceLength = ordDay.diff(enlistment, 'days') + 1
let yearLength = endOfYear.diff(startOfWorkYear, 'days') + 1

let leaveEntitled = Math.round(14 * yearLength / 365)
let thisYear = now.get('year')
let thisYearLeave = leaveUsed.filter(leave => leave.year === thisYear)
let thisYearClocked = thisYearLeave.reduce((acc, leave) => acc + leave.duration, 0)

function initHomePage() {
  document.querySelector('#pop-counter > span.main-number').textContent = daysToPOP
  document.querySelector('#ord-counter > span.main-number').textContent = daysToORD
  document.querySelector('#pay-counter > span.main-number').textContent = daysToPay
  document.querySelector('#leave-counter > span.main-number').textContent = `${leaveEntitled - thisYearClocked}/${leaveEntitled}`


  document.querySelector('#pop-counter').className = `c100 p${Math.round(100 - 100 * (daysToPOP / bmtLength))} blue`
  document.querySelector('#ord-counter').className = `c100 p${Math.round(100 - 100 * (daysToORD / serviceLength))} pink`
  document.querySelector('#pay-counter').className = `c100 p${Math.round(100 * (daysToPay / (daysFromLastPay + daysToPay)))} green`
  document.querySelector('#leave-counter').className = `c100 p${Math.round(100 * (thisYearClocked / leaveEntitled))} orange`
}

function initLeavePage() {
  let html = thisYearLeave.map(leave => {
    return `<h2>${leave.title} (${leave.day.format('DD MMM YYYY')})</h2>
<p>Duration: ${leave.duration === 0.5 ? 'Half' : 'Full'} Day</p>`
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
