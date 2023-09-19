<script>
import {Container, Row, Col, Form, Input, FormText, Button} from 'sveltestrap'
import {site, cert, user, address} from '../../dir/init.js'
import {push, link} from 'svelte-spa-router'
import Message from './Message.svelte'
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()
export let auth
export let post
export let mid
export let haveparent
let doesItFollow
let getparenta = haveparent
let getparentz = !haveparent
let showMessage = false
let showFrom = false
let arrFrom = []
let arrTo = []
let showTo = false
let checkFrom = 'zzzzzzzzzzzzzzzzzz'
let checkTo = 'zzzzzzzzzzzzzzzzzz'
function paginateFrom(data){
    site.get('posts').get(post.id).get('from').get({'.': {'>': '0', '<': data}, '%': 50000}).once().map().once((datas) => {
        if(datas){
            if(datas.id){
                if(datas.id < checkFrom){
                    checkFrom = datas.id
                }
                arrFrom.push(datas)
                arrFrom = arrFrom
            }
        }
    })
}
function paginateTo(data){
    site.get('posts').get(post.id).get('to').get({'.': {'>': '0', '<': data}, '%': 50000}).once().map().once((datas) => {
        if(datas){
            if(datas.id){
                if(datas.id < checkTo){
                    checkTo = datas.id
                }
                arrTo.push(datas)
                arrTo = arrTo
            }
        }
    })
}
function handleMessage(data){
    showMessage = false
    if(data.detail.id < checkFrom){
        checkFrom = data.detail.id
    }
    arrFrom.push(data.detail)
    arrFrom = arrFrom
    dispatch('refresh', post.id)
}
function handleTrashFrom(data){
    let checkId = null
    for(const [k, v] of arrFrom){
        if(v.id === data.detail){
            checkId = k
            break
        }
    }
    if(checkId !== null){
        arrFrom.splice(checkId, 1)
    }
    arrFrom = arrFrom
}
function handleTrashTo(data){
    let checkId = null
    for(const [k, v] of arrTo){
        if(v.id === data.detail){
            checkId = k
            break
        }
    }
    if(checkId !== null){
        arrTo.splice(checkId, 1)
    }
    arrTo = arrTo
}
function handleRefreshFrom(data){
    for(const test of arrFrom){
        if(test.id === data.detail){
            if(!test.replies){
                test.replies = true
                break
            }
        }
    }
    arrFrom = arrFrom
}
function handleRefreshTo(data){
    for(const test of arrTo){
        if(test.id === data.detail){
            if(!test.replies){
                test.replies = true
                break
            }
        }
    }
    arrTo = arrTo
}
function follow(e){
    console.log(e)
    const usePost = site.get('posts').get(post.id)
    user.get(address).get('follows').get('posts').get(post.id).put(usePost, null, {opt: {cert}}).once((data) => {
        doesItFollow = Boolean(data)
    })
}
function unFollow(e){
    console.log(e)
    user.get(address).get('follows').get('posts').get(post.id).put(null, null, {opt: {cert}}).once((data) => {
        doesItFollow = Boolean(data)
    })
}
$: {
    if(auth && auth !== post.iden){
        user.get(address).get('follows').get('posts').get(post.id).once((data) => {
            doesItFollow = Boolean(data)
        })
    }
}
</script>
<Row class="m-3">
    <Col class="border p-3">
        {#if post.replied}
        <Col>
            <Button type="button" on:click={(e) => {
                console.log(e)
                showTo = !showTo
                if(!arrTo.length){
                    paginateTo(checkTo)
                }
            }}>Replied</Button>
        </Col>
        {/if}
        {#if showTo}
        <Row>
            <Col>
                {#if arrTo.length}
                    {#each arrTo as chat}
                    {#if mid === chat.id}
                        <p class:getparenta class:getparentz>{chat.id}</p>
                    {:else}
                    <div class:getparenta class:getparentz>
                        <svelte:self post={chat} auth={auth} mid={post.id} haveparent={getparentz} on:trash={handleTrashTo} on:refresh={handleRefreshTo}/>
                    </div>
                    {/if}
                    {/each}
                {:else}
                <p>no replied</p>
                {/if}
                <Button type="button" on:click={(e) => {
                    console.log(e)
                    paginateTo(checkTo)
                }}>More</Button>
            </Col>
        </Row>
        {/if}
        <Row>
            <Col>
                {#if post.file}
                {#if post.file.endsWith('.png') || post.file.endsWith('.jpg') || post.file.endsWith('.jpeg') || post.file.endsWith('.webp') || post.file.endsWith('.gif')}
                    <img src={post.file} alt={post.file}>
                    {:else if post.file.endsWith('.mp3') || post.file.endsWith('.wav') || post.file.endsWith('flac') || post.file.endsWith('aac')}
                    <audio src={post.file} controls></audio>
                    {:else if post.file.endsWith('.mp4') || post.file.endsWith('.mov') || post.file.endsWith('.3gp') || post.file.endsWith('.webm')}
                    <video src={post.file} controls></video>
                    {:else}
                    <p>file not supported</p>
                {/if}
            {/if}
            {#if post.text}
                <p>{post.text}</p>
            {/if}
            <p>{new Date(post.stamp)}
                 | <span style="font-size: 6px;"><a href={'/users/' + post.iden} use:link>{post.iden}</a></span>
                {#if post.category}
                 | <a href={'/categories/' + post.category} use:link>{post.category}</a>
                {/if}
                {#if post.comment}
                 | <a href={'/comments/' + post.comment} use:link>{post.comment}</a>
                {/if}
                 | <a href={'/posts/' + post.id} use:link>{post.id}</a>
            </p>
            </Col>
        </Row>
        {#if auth}
            {#if showMessage}
                <Message post={post} auth={auth} on:message={handleMessage}/>
            {/if}
            <Row>
                {#if auth === post.iden}
                <Col>
                    <Button type="button" on:click={(e) => {
                        console.log(e)
                        site.get('posts').get(post.id).put(null, null, {opt: {cert}})
                        site.get('categories').get(post.category).get(post.id).put(null, null, {opt: {cert}})
                        site.get('users').get(user.is.pub).get(post.id).put(null, null, {opt: {cert}})
                        // if(post.replied){
                        //     site.get('posts').get(post.replied).get('from').get(post.id).put(null, null, {opt: {cert}})
                        //     site.get('categories').get(post.category).get(post.replied).get('from').get(post.id).put(null, null, {opt: {cert}})
                        // }
                        dispatch('trash', post.id)
                    }}>Trash</Button>
                </Col>
                {/if}
                {#if auth !== post.iden}
                <Col>
                    {#if doesItFollow}
                        <Button type="button" on:click={unFollow}>UnFollow</Button>
                    {:else}
                        <Button type="button" on:click={follow}>Follow</Button>
                    {/if}
                </Col>
                {/if}
                <Col>
                    <Button type="button" on:click={(e) => {
                        console.log(e)
                        showMessage = !showMessage
                    }}>Reply</Button>
                </Col>
            </Row>
        {/if}
        {#if showFrom}
        <Row>
            <Col>
                {#if arrFrom.length}
                    {#each arrFrom as chat}
                    {#if mid === chat.id}
                        <p class:getparenta class:getparentz>{chat.id}</p>
                    {:else}
                    <div class:getparenta class:getparentz>
                        <svelte:self post={chat} auth={auth} mid={post.id} haveparent={getparentz} on:trash={handleTrashFrom} on:refresh={handleRefreshFrom}/>
                    </div>
                    {/if}
                    {/each}
                {:else}
                <p>no replies</p>
                {/if}
                <Button type="button" on:click={(e) => {
                    console.log(e)
                    paginateFrom(checkFrom)
                }}>More</Button>
            </Col>
        </Row>
        {/if}
    </Col>
</Row>

<style>
    .getparenta {
        background-color: #f8f8f8;
    }
    .getparentz {
        background-color: #e6e6e6;
    }
</style>