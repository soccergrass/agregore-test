<script>
import { Row, Col, Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, Button, NavLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Form, InputGroup, Input } from 'sveltestrap'
// import {push, link} from 'svelte-spa-router'
import {site, cert, user, auth} from '../../dir/init.js'
// import {nanoid}../Comp/Post.svelte.js
import Post from '../Comp/Post.svelte'
import {onDestroy, onMount} from 'svelte'
import Message from './Message/HomeMessage.svelte'
// import { createEventDispatcher } from 'svelte'

// const dispatch = createEventDispatcher()
let isAuth
let useSub
let arr = []
let check = 'zzzzzzzzzzzzzzzz'
function paginate(data){
    site.get('posts').get({'.': {'>': '0', '<': data}, '%': 50000}).once().map().once((datas) => {
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
    for(let i = 0;i < arr.length;i++){
        if(arr[i].id === e.detail){
            checkId = i
            break
        }
    }
    if(checkId !== null){
        arr.splice(checkId, 1)
    }
    arr = arr
}
function handleMessage(data){
    console.log(data)
    if(data.detail.id < check){
        check = data.detail.id
    }
    arr.push(data.detail)
    arr = arr
}
onMount(() => {
    useSub = auth.subscribe((data) => {isAuth = data});
    paginate(check);
})
onDestroy(() => {useSub()})
</script>

{#if isAuth}
    <Message isAuth={isAuth} on:message={handleMessage}/>
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