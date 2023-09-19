<script>
import { Row, Col, Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, Button, NavLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Form, InputGroup, Input } from 'sveltestrap'
// import {push, link} from 'svelte-spa-router'
import {site, cert, user, auth, address} from '../../dir/init.js'
// import {nanoid}../Comp/Post.svelte.js
import {onDestroy, onMount} from 'svelte'
import Post from '../Comp/Post.svelte'
import MD5 from 'crypto-js/md5.js'
import Message from './Message/CategoryMessage.svelte'
// import { createEventDispatcher } from 'svelte'

// const dispatch = createEventDispatcher()
export let params = {}
let isAuth
let useSub
let err
let doesItFollow

let arr = []
let check = 'zzzzzzzzzzzzzzzzzzz'
function paginate(data){
    site.get('categories').get(params.category).get({'.': {'>': '0', '<': data}, '%': 50000}).once().map().once((datas) => {
        if(datas){
            if(datas.id){
                if(datas.id < check){
                    check = datas.id
                }
                arr.push(datas)
                arr = arr
            }
        }
    })
}
function handleRefresh(e){
    for(const test of arr){
        if(test.id === e.detail){
            if(!test.replies){
                test.replies = true
                break
            }
        }
    }
    arr = arr
}
function handleTrash(e){
    let checkId = null
    for(const [k, v] of arr){
        if(v.id === e.detail){
            checkId = k
            break
        }
    }
    if(checkId !== null){
        arr.splice(checkId, 1)
    }
    arr = arr
}
function handleMessage(data){
    if(data.detail.id < check){
        check = data.detail.id
    }
    arr.push(data.detail)
    arr = arr
}

function unFollow(e){
    console.log(e)
    user.get(address).get('follows').get('categories').get(params.category).put(null, null, {opt: {cert}}).once((data) => {
        doesItFollow = Boolean(data)
    })
}
function follow(e){
    console.log(e)
    user.get(address).get('follows').get('categories').get(params.category).put(params.category, null, {opt: {cert}}).once((data) => {
        doesItFollow = Boolean(data)
    })
}
onMount(() => {
    useSub = auth.subscribe((data) => {
        isAuth = data
        if(isAuth){
            user.get(address).get('follows').get('categories').get(params.category).once((data) => {
                doesItFollow = Boolean(data)
            })
        }
    });
    paginate(check);
})
onDestroy(() => {
    useSub()
})
</script>

<Row>
    <Col>
        <h1>{params.category}</h1>
        {#if isAuth}
        {#if doesItFollow}
        <Button type="button" on:click={unFollow}>UnFollow</Button>
        {:else}
        <Button type="button" on:click={follow}>Follow</Button>
        {/if}
        {/if}
    </Col>
</Row>

{#if err}
    <Row class="mt-4">
        <Col>
            <p>{err}</p>
        </Col>
    </Row>
{/if}

{#if isAuth}
<Message isAuth={isAuth} isCategory={params.category} on:message={handleMessage}/>
{/if}

{#if arr.length}
    {#each arr as post}
    <Post post={post} auth={isAuth} mid={null} haveparent={false} on:refresh={handleRefresh} on:trash={handleTrash}/>
    {/each}
    <Row>
        <Col>
            <Button type="button" on:click={(e) => {
                console.log(e)
                paginate(check)
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
<style>
</style>