<script>
import {Container, Row, Col, Form, Input, FormText, Button} from 'sveltestrap'
import {site, cert, user, address, auth} from '../../dir/init.js'
import {push, link} from 'svelte-spa-router'
import {onDestroy, onMount} from 'svelte'
import Message from './Message/PostMessage.svelte'
import Post from '../Comp/Post.svelte'

export let params = {}
let isAuth
let useSub
let post
let err
let doesItFollow
site.get('posts').get(params.post).once((data) => {
    if(data && data.id){
        post = data
    } else {
        err = 'no post here'
    }
})
let showFrom = false
let arrFrom = []
let arrTo = []
let showTo = false
let checkFrom = 'zzzzzzzzzzzzzzzzzz'
let checkTo = 'zzzzzzzzzzzzzzzzzz'
function paginateFrom(data){
    site.get('posts').get(params.post).get('from').get({'.': {'>': '0', '<': data}, '%': 50000}).once().map().once((datas) => {
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
    site.get('posts').get(params.post).get('to').get({'.': {'>': '0', '<': data}, '%': 50000}).once().map().once((datas) => {
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
    if(data.detail.id < checkFrom){
        checkFrom = data.detail.id
    }
    arrFrom.push(data.detail)
    arrFrom = arrFrom
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

onMount(() => {
    useSub = auth.subscribe((data) => {
        isAuth = data
        if(isAuth && post && isAuth !== post.iden){
            user.get(address).get('follows').get('posts').get(post.id).once((data) => {
                doesItFollow = Boolean(data)
            })
        }
    })
})
onDestroy(() => {
    useSub()
})

function follow(e){
    console.log(e)
    const usePost = site.get('posts').get(params.post)
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
</script>

{#if err}
<Row>
    <Col>
        <p>{err}</p>
    </Col>
</Row>
{/if}

{#if post}
<Row class="m-3">
    <Col class="border p-3">
        {#if post.replied}
        <Row>
            <Col>
                <Button type="button" on:click={(e) => {
                    console.log(e)
                    showTo = !showTo
                    if(!arrTo.length){
                        paginateTo(checkTo)
                    }
                }}>Replied</Button>
            </Col>
        </Row>
        {/if}
        {#if showTo}
        <Row>
            <Col>
                {#if arrTo.length}
                    {#each arrTo as chat}
                    <Post post={chat} auth={isAuth} mid={post.id} haveparent={false} on:trash={handleTrashTo} on:refresh={handleRefreshTo}/>
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
                <h1>{post.id}</h1>
            </Col>
        </Row>
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
            </p>
            </Col>
        </Row>
        {#if isAuth}
            <Message post={post} isAuth={isAuth} on:message={handleMessage}/>
            <Row>
                {#if isAuth === post.iden}
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
                    }}>Trash</Button>
                </Col>
                {/if}
                {#if isAuth !== post.iden}
                <Col>
                    {#if doesItFollow}
                    <Button type="button" on:click={unFollow}>UnFollow</Button>
                    {:else}
                    <Button type="button" on:click={follow}>Follow</Button>
                    {/if}
                </Col>
                {/if}
            </Row>
        {/if}
        {#if post.replies}
        <Row>
            <Col>
                <Button type="button" on:click={(e) => {
                    console.log(e)
                    showFrom = !showFrom
                    if(!arrFrom.length){
                        paginateFrom(checkFrom)
                    }
                }}>Replies</Button>
            </Col>
        </Row>
        {/if}
        {#if showFrom}
        <Row>
            <Col>
                {#if arrFrom.length}
                    {#each arrFrom as chat}
                    <Post post={chat} auth={isAuth} mid={post.id} haveparent={false} on:trash={handleTrashFrom} on:refresh={handleRefreshFrom}/>
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
{/if}

<style>
</style>