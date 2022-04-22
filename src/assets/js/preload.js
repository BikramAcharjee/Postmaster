function notifyMe () {
    const notification = new window.Notification('Helo User', {
      body: 'How is your day?'
    })
    // notification.onclick = () => console.log('Clicked')
    // notification.onclose = () => console.log('Closed')
  }
  
  window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#notification').onclick = notifyMe
  })
  