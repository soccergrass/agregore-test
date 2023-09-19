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
    user.get(address).get('follows').get('categories').get({'.': {'>': '0', '<': data}, '%': 50000}).once().map().once((datas) => {
        if(datas){
            if(datas < check){
                check = datas
            }
            arr.push({follow: true, category: datas})
            arr = arr
        }
    })
}
function unFollow(e){
    user.get(address).get('follows').get('categories').get(e).put(null, null, {opt: {cert}}).once((datas) => {
        for(let i = 0;i < arr.length;i++){
            if(arr[i].user === e){
                arr[i].follow = Boolean(datas)
            }
        }
    })
}
function follow(e){
    user.get(address).get('follows').get('categories').get(e).put(e, null, {opt: {cert}}).once((datas) => {
        for(let i = 0;i < arr.length;i++){
            if(arr[i].user === e){
                arr[i].follow = Boolean(datas)
            }
        }
    })
}

onMount(() => {
    useSub = auth.subscribe((data) => {
        isAuth = data
        if(!isAuth){
            replace('/')
        }
    });
    paginate(check);
})
onDestroy(() => {
    useSub()
})
</script>

{#if arr.length}
    {#each arr as prop}
        <Row>
            <Col>
                <p><a href={'/category/' + prop.category} use:link>{prop.category}</a></p>
                {#if prop.follow}
                <Button type="button" on:click={(e) => {console.log(e);unFollow(prop.category);}}>UnFollow</Button>
                {:else}
                <Button type="button" on:click={(e) => {console.log(e);follow(prop.category);}}>Follow</Button>
                {/if}
            </Col>
        </Row>
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
        <p>no categories here</p>
    </Col>
</Row>
{/if}
<style></style>