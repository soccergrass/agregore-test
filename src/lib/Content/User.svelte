<script>
import { Row, Col, Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, Button, NavLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Form, InputGroup, Input } from 'sveltestrap'
import {site, cert, user, auth, address} from '../../dir/init.js'
import {onDestroy, onMount} from 'svelte'
import Post from '../Comp/Post.svelte'
import Message from './Message/UserMessage.svelte'

export let params = {}
let isAuth
let useSub

let arrUser = []
let arrComment = []
let checkUser = 'zzzzzzzzzzzzzzzzzzz'
let checkComment = 'zzzzzzzzzzzzzzzzzzz'
let doesItFollow
function paginateUser(data){
    site.get('users').get(params.user).get({'.': {'>': '0', '<': data}, '%': 50000}).once().map().once((datas) => {
        if(datas){
            if(datas.id){
                if(datas.id < checkUser){
                    checkUser = datas.id
                }
                arrUser.push(datas)
                arrUser = arrUser
            }
        }
    })
}
function paginateComment(data){
    site.get('comments').get(params.user).get({'.': {'>': '0', '<': data}, '%': 50000}).once().map().once((datas) => {
        if(datas){
            if(datas.id){
                if(datas.id < checkComment){
                    checkComment = datas.id
                }
                arrComment.push(datas)
                arrComment = arrComment
            }
        }
    })
}
function handleRefreshComment(e){
    for(const test of arrComment){
        if(test.id === e.detail){
            if(!test.replies){
                test.replies = true
                break
            }
        }
    }
    arrComment = arrComment
}
function handleRefreshUser(e){
    for(const test of arrUser){
        if(test.id === e.detail){
            if(!test.replies){
                test.replies = true
                break
            }
        }
    }
    arrUser = arrUser
}
function handleTrashComment(e){
    let checkId = null
    for(const [k, v] of arrComment){
        if(v.id === e.detail){
            checkId = k
            break
        }
    }
    if(checkId !== null){
        arrComment.splice(checkId, 1)
    }
    arrComment = arrComment
}
function handleTrashUser(e){
    let checkId = null
    for(const [k, v] of arrUser){
        if(v.id === e.detail){
            checkId = k
            break
        }
    }
    if(checkId !== null){
        arrUser.splice(checkId, 1)
    }
    arrUser = arrUser
}
function unFollow(e){
    console.log(e)
    user.get(address).get('follows').get('users').get(params.user).put(null, null, {opt: {cert}}).once((data) => {
        doesItFollow = Boolean(data)
    })
}
function follow(e){
    console.log(e)
    user.get(address).get('follows').get('users').get(params.user).put(params.user, null, {opt: {cert}}).once((data) => {
        doesItFollow = Boolean(data)
    })
}

function handleMessage(data){
    if(data.detail.id < checkComment){
        checkComment = data.detail.id
    }
    arrComment.push(data.detail)
    arrComment = arrComment
}

onMount(() => {
    useSub = auth.subscribe((data) => {
        isAuth = data
        if(isAuth){
            user.get(address).get('follows').get('users').get(params.user).once((data) => {
                doesItFollow = Boolean(data)
            })
        }
    })
    paginateUser(checkUser)
    paginateComment(checkComment)
})
onDestroy(() => {
    useSub()
})
</script>

<Row>
    <Col>
        <h1 style="font-size: 16px">{params.user}</h1>
        {#if isAuth}
        {#if doesItFollow}
        <Button type="button" on:click={unFollow}>UnFollow</Button>
        {:else}
        <Button type="button" on:click={follow}>Follow</Button>
        {/if}
        {/if}
    </Col>
</Row>

{#if isAuth}
<Message isAuth={isAuth} isComment={params.user} on:message={handleMessage}/>
{/if}

<Row>
    <Col>
        {#if arrUser.length}
        {#each arrUser as post}
        <Post post={post} auth={isAuth} mid={null} haveparent={false} on:refresh={handleRefreshUser} on:trash={handleTrashUser}/>
        {/each}
        <Row>
            <Col>
                <Button type="button" on:click={(e) => {
                    console.log(e)
                    paginateUser(checkUser)
                }}>More</Button>
            </Col>
        </Row>
        {:else}
        <Row class="mt-4">
            <Col>
                <p>no posts here</p>
            </Col>
        </Row>
        {/if}
    </Col>
    <Col>
        {#if arrComment.length}
        {#each arrComment as post}
        <Post post={post} auth={isAuth} mid={null} haveparent={false} on:refresh={handleRefreshComment} on:trash={handleTrashComment}/>
        {/each}
        <Row>
            <Col>
                <Button type="button" on:click={(e) => {
                    console.log(e)
                    paginateComment(checkComment)
                }}>More</Button>
            </Col>
        </Row>
    {:else}
    <Row class="mt-4">
        <Col>
            <p>no posts here</p>
        </Col>
    </Row>
    {/if}
    </Col>
</Row>
<style>
</style>