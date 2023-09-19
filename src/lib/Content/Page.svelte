<script>
import { Row, Col, Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, Button, NavLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Form, InputGroup, Input } from 'sveltestrap'
import {push, link, replace} from 'svelte-spa-router'
import {site, cert, user, auth, address} from '../../dir/init.js'
// import {nanoid}../Comp/Post.svelte.js
import {onDestroy, onMount} from 'svelte'
import Post from '../Comp/Post.svelte'
import MD5 from 'crypto-js/md5.js'
// import { createEventDispatcher } from 'svelte'

// const dispatch = createEventDispatcher()
let isAuth
let useSub

let arr = []
let check = 'zzzzzzzzzzzzzzzzzzz'
function paginate(data){
    site.get('users').get(isAuth).get({'.': {'>': '0', '<': data}, '%': 50000}).once().map().once((datas) => {
        if(datas.id){
            if(datas < check){
                check = datas.id
            }
            arr.push(datas)
            arr = arr
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

onMount(() => {
    useSub = auth.subscribe((data) => {
        isAuth = data
        if(!isAuth){
            replace('/')
        } else {
            paginate(check)
        }
    });
})
onDestroy(() => {
    useSub()
})
</script>

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
<style></style>