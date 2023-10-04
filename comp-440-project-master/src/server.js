/* eslint-disable no-console */
const SERVER_IP = 'localhost:5000'

export const REQUEST = {
    USER: 1,
    LOGIN: 2,
    RESET: 3,
    INIT: 4,
    BLOG: 5,
    COMMENT: 6,
    POST: 7,
    HOBBY: 8,
    TAG: 9,
    FOLLOW: 10,
    UNFOLLOW: 11,
    FOLLOWERS: 12,
    FOLLOWEES: 13
}

export async function sendData(requestType, data) {
    switch (requestType) {
        case REQUEST.USER:
            requestType = 'post?type=user'
            break
        case REQUEST.LOGIN:
            requestType = 'post?type=login'
            break
        case REQUEST.RESET:
            requestType = 'post?type=reset'
            break
        case REQUEST.INIT:
            requestType = 'post?type=initialize'
            break
        case REQUEST.BLOG:
            requestType = 'post?type=blog'
            break
        case REQUEST.COMMENT:
            requestType = 'post?type=comment'
            break
        case REQUEST.FOLLOW:
            requestType = 'post?type=follow'
            break
        case REQUEST.UNFOLLOW:
            requestType = 'post?type=unfollow'
            break
        default:
            throw new Error('Invalid request type!')
    }
    try {
        console.log(JSON.stringify(data))
        const response = await fetch(`http://${SERVER_IP}/${requestType}`, {
            method: 'POST',
            headers: new Headers({ 'content-type': 'text/plain' }),
            body: JSON.stringify(data),
        })
        return await response.json()
    } catch (error) {
        return console.log('POST Request Failed: ' + error)
    }
}

export async function getData(requestType, id) {
    if (!id) id = 'all'
    switch (requestType) {
        case REQUEST.BLOG:
            requestType = 'get?blog='
            break
        case REQUEST.COMMENT:
            requestType = 'get?comment='
            break
        case REQUEST.USER:
            requestType = 'get?user='
            break
        case REQUEST.HOBBY:
            requestType = 'get?hobby='
            break
        case REQUEST.TAG:
            requestType = `get?tag=${id[0]}&tag=${id[1]}`
            id = ''
            break
        case REQUEST.FOLLOWERS:
            requestType = 'get?followers='
            break
        case REQUEST.FOLLOWEES:
            requestType = `get?followees=${id[0]}&followees=${id[1]}`
            id = ''
            break
        default:
            throw new Error('Invalid request type!')
    }
    try {
        const response = await fetch(`http://${SERVER_IP}/${requestType}${id}`)
        return await response.json()
    } catch (error) {
        return console.log('GET Request Failed: ' + error)
    }
}
