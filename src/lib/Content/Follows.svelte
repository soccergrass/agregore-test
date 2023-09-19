<script>
import {push, link, replace} from 'svelte-spa-router'
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, Button, NavLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Form, InputGroup, Input, InputGroupText, Row, Col } from 'sveltestrap'
import {onDestroy, onMount} from 'svelte'
import {auth} from '../../dir/init.js'

let isAuth
let useSub
onMount(() => {
  useSub = auth.subscribe((data) => {
    isAuth = data
    if(!isAuth){
      replace('/')
    }
  });
})
onDestroy(() => {
  useSub();
})
</script>

<Row>
    <Col><a href="/follows/users" use:link>Users</a></Col>
    <Col><a href="/follows/posts" use:link>Posts</a></Col>
    <Col><a href="/follows/categories" use:link>Categories</a></Col>
</Row>