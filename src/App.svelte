<script>
import {Container, Row, Col, Form, Input, FormText, Button} from 'sveltestrap'
import Router from 'svelte-spa-router'
import {wrap} from 'svelte-spa-router/wrap.js'
import Header from './lib/Header.svelte'
import Home from './lib/Content/Home.svelte'
import Category from './lib/Content/Category.svelte'
import Post from './lib/Content/Post.svelte'
import User from './lib/Content/User.svelte'
import Follows from './lib/Content/Follows.svelte'
import FollowUsers from './lib/Content/FollowUser.svelte'
import FollowPosts from './lib/Content/FollowPost.svelte'
import FollowCategories from './lib/Content/FollowCategory.svelte'
import Page from './lib/Content/Page.svelte'
import Misc from './lib/Misc.svelte'
import Footer from './lib/Footer.svelte'

const routes = {
  // Exact path
  '/': wrap({component: Home}),

  '/categories/:category': wrap({component: Category}),

  '/page': wrap({component: Page}),

  // Wildcard parameter
  '/posts/:post': wrap({component: Post}),

  '/users/:user': wrap({component: User}),

  '/follows': wrap({component: Follows}),
  '/follows/users': wrap({component: FollowUsers}),
  '/follows/posts': wrap({component: FollowPosts}),
  '/follows/categories': wrap({component: FollowCategories}),

  // Catch-all
  // This is optional, but if present it must be the last
  '*': wrap({component: Misc})
}
</script>

<Container fluid>
  <Header/>
  <Router {routes}/>
  <Footer/>
</Container>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
