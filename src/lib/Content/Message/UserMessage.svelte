<script>
import { Row, Col, Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, Button, NavLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Form, InputGroup, Input } from 'sveltestrap'
import {site, cert, user, auth, ipfs, hyper} from '../../../dir/init.js'
import MD5 from 'crypto-js/md5.js'
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()
export let isAuth
export let isComment
let radios
let err
function handleType(){
    if(radios === 'ipfs'){
        return ipfs
    } else if(radios === 'hyper'){
        return hyper
    } else {
        throw new Error('type of post is not valid')
    }
}

async function handleSubmit(e){
    console.log(e)
    if((!document.getElementById('file').files || !document.getElementById('file').files.length) && !document.getElementById('text').value){
        return
    }
    if((document.getElementById('file').files && document.getElementById('file').files.length) && !radios){
        return
    }
    let useFile
    if(document.getElementById('file').files && document.getElementById('file').files.length){
        const formData = new FormData()
        for(let i = 0;i < document.getElementById('file').files.length;i++){
            formData.append('file', document.getElementById('file').files[i], document.getElementById('file').files[i].name)
        }
        useFile = (await fetch(handleType(), {method: 'PUT', body: formData})).headers.get('Location') + document.getElementById('file').files[0].name
    }
    let useText = document.getElementById('text').value
    // const id = MD5(useText || useFile[0]).toString()
    const stamp = Date.now()
    const sendMessage = {id: stamp + '-' + MD5(useText || useFile[0]).toString(), stamp, replied: false, replies: false, iden: isAuth, file: useFile ? useFile : null, text: useText, category: document.getElementById('category').value || null, comment: isComment}
    const makePost = site.get('posts').get(sendMessage.id).put(sendMessage, null, {opt: {cert}})
    if(sendMessage.category){
        site.get('categories').get(sendMessage.category).get(sendMessage.id).put(makePost, null, {opt: {cert}})
    }
    site.get('users').get(sendMessage.iden).get(sendMessage.id).put(makePost, null, {opt: {cert}})
    site.get('comments').get(sendMessage.comment).get(sendMessage.id).put(makePost, null, {opt: {cert}})
    document.getElementById('file').value = null
    document.getElementById('text').value = ''
    document.getElementById('category').value = ''
    radios = null
    // dispatch('message', sendMessage)
    return sendMessage
}
</script>

{#if err}
    <Row class="mt-4">
        <Col>
            <p>{err}</p>
        </Col>
    </Row>
{/if}

<Row class="mt-4">
    <Col>
        <Form>
            <Input type="radio" bind:group={radios} value="ipfs" label="ipfs"/>
            <Input type="radio" bind:group={radios} value="hyper" label="hyper"/>
            <Input type="text" placeholder="category" id="category"/>
            <Input type="file" id="file"/>
            <Input type="textarea" placeholder="post" id="text"/>
            <Button type="button" on:click={(e) => {
                handleSubmit(e).then((data) => {dispatch('message', data)}).catch((e) => {err = e.message;setTimeout(() => {err = null}, 5000);})
            }}>submit</Button>
        </Form>
    </Col>
</Row>
<style></style>