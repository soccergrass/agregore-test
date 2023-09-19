<script>
import { Row, Col, Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, Button, NavLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Form, InputGroup, Input } from 'sveltestrap'
import {push, link} from 'svelte-spa-router'
import {onMount, onDestroy} from 'svelte'
import {site, user, config} from '../dir/init.js'

// let showMessage = true
let conf = $config
let useConf
function handleAuto(e){
    console.log(e)
    let test = {...conf, auto: true}
    config.set(test)
    localStorage.setItem('config', JSON.stringify(test))
}
function handleUnAuto(e){
    console.log(e)
    let test = {auto: false, pair: null}
    config.set(test)
    localStorage.setItem('config', JSON.stringify(test))
}
onMount(() => {useConf = config.subscribe((data) => {conf = data})})
onDestroy(() => {useConf()})
</script>

<Navbar>
<NavbarBrand><a href="/" use:link>Home</a></NavbarBrand>
<Nav navbar>
    <NavItem>
        <span>test</span>
    </NavItem>
</Nav>
<Nav class="ms-auto" navbar>
    <NavItem>
    {#if conf.auto}
        <Button type="button" on:click={handleUnAuto}>Un-Auto</Button>
    {/if}
    {#if !conf.auto}
        <Button type="button" on:click={handleAuto}>Auto</Button>
    {/if}
    </NavItem>
</Nav>
</Navbar>

<style></style>