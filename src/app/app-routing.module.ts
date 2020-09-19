import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PostsComponent} from './posts/posts.component';
import {WelcomeComponent} from './welcome/welcome.component';

const routes: Routes = [
  {
    path: 'posts',
    component: PostsComponent,
  },
  {
    path: '',
    component: WelcomeComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule {
}
