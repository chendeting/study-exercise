import './heading.css'

export default () => {
    const ele = document.createElement('h2')
    ele.textContent = 'Hello, look blue sky ~ one ~ two ~ three ~ four---'
    ele.classList.add('heading')
    ele.addEventListener('click', () => {
        alert('sky is blue~~')
    })
    return ele
}