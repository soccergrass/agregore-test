<script>
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, Button, NavLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Form, InputGroup, Input, InputGroupText, Row, Col } from 'sveltestrap'
import {push, link} from 'svelte-spa-router'
import {user, config, auth} from '../dir/init.js'
import {onDestroy, onMount} from 'svelte'
// import {nanoid} from 'nanoid'

let isAuth
let useSub
let conf = $config
let useConf
let msg
function handleRegister(e){
  console.log(e)
  if(document.getElementById('user').value && document.getElementById('pass').value){
    user.create(document.getElementById('user').value, document.getElementById('pass').value, (data) => {
      if(data.err){
        msg = data.err
        setTimeout(() => {if(msg){msg = null}}, 5000)
        if(document.getElementById('user') && document.getElementById('user').value){
          document.getElementById('user').value = ''
        }
        if(document.getElementById('pass') && document.getElementById('pass').value){
          document.getElementById('pass').value = ''
        }
      } else {
        msg = 'created user'
        setTimeout(() => {if(msg){msg = null}}, 5000)
        handleLogin(e)
      }
    })
  }
}
function handleLogin(e){
  console.log(e)
  if(document.getElementById('user').value && document.getElementById('pass').value){
    user.auth(document.getElementById('user').value, document.getElementById('pass').value, (datas) => {
    if(datas.err){
      msg = datas.err
      setTimeout(() => {if(msg){msg = null}}, 5000)
      user.auth({pub: document.getElementById('user').value, priv: document.getElementById('pass').value}, (datas) => {
        if(datas.err){
          msg = datas.err
          setTimeout(() => {if(msg){msg = null}}, 5000)
        } else {
          if(conf.auto){
            let test = {auto: conf.auto, pair: {pub: datas.sea.pub, priv: datas.sea.priv}}
            config.set(test)
            localStorage.setItem('config', JSON.stringify(test))
          }
          msg = 'user logged in'
          setTimeout(() => {if(msg){msg = null}}, 5000)
          auth.set(datas.sea.pub)
        }
        if(document.getElementById('user') && document.getElementById('user').value){
          document.getElementById('user').value = ''
        }
        if(document.getElementById('pass') && document.getElementById('pass').value){
          document.getElementById('pass').value = ''
        }
      })
    } else {
      if(conf.auto){
        let test = {auto: conf.auto, pair: {pub: datas.sea.pub, priv: datas.sea.priv}}
        config.set(test)
        localStorage.setItem('config', JSON.stringify(test))
      }
      msg = 'user logged in'
      setTimeout(() => {if(msg){msg = null}}, 5000)
      auth.set(datas.sea.pub)
    }
    if(document.getElementById('user') && document.getElementById('user').value){
      document.getElementById('user').value = ''
    }
    if(document.getElementById('pass') && document.getElementById('pass').value){
      document.getElementById('pass').value = ''
    }
  })
  }
}
function handleLogout(e){
  console.log(e)
  user.leave()
  msg = 'logged out'
  setTimeout(() => {if(msg){msg = null}}, 5000)
  auth.set(null)
  if(document.getElementById('user') && document.getElementById('user').value){
    document.getElementById('user').value = ''
  }
  if(document.getElementById('pass') && document.getElementById('pass').value){
    document.getElementById('pass').value = ''
  }
}
onMount(() => {
  useSub = auth.subscribe((data) => {isAuth = data});
  useConf = config.subscribe((data) => {conf = data});
})
onDestroy(() => {
  useSub();
  useConf();
})
</script>

<Navbar>
<NavbarBrand><a href="/" use:link>Home</a></NavbarBrand>
<Nav navbar>
  {#if isAuth}
    <NavItem><span style="font-size: 6px;">{isAuth}</span><a href="/follows" use:link>Follows</a><a href="/page" use:link>Page</a></NavItem>
    <!-- <NavItem><a href="/page" use:link>Page</a></NavItem>
    <NavItem><a href="/follows" use:link>Follows</a></NavItem> -->
  {:else}
    <NavItem><span>login to see the pub key</span></NavItem>
  {/if}
</Nav>
<Nav class="ms-auto" navbar>
  <NavItem>
    {#if isAuth}
    <Button type="button" on:click={handleLogout}>Logout</Button>
    {:else}
    <InputGroup>
    <Input placeholder="user/pub" id="user"/>
    <Input placeholder="pass/pri" id="pass"/>
    <Button type="button" on:click={handleLogin}>Login</Button>
    <Button type="button" on:click={handleRegister}>Register</Button>
    </InputGroup>
    {/if}
  </NavItem>
</Nav>
</Navbar>
{#if msg}
<Row class="my-3">
  <Col>
    <p>{msg}</p>
  </Col>
</Row>
{/if}

<style></style>