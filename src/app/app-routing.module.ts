import { NgModule }                   from '@angular/core';
import { RouterModule, Routes }       from '@angular/router';

import { DashboardComponent }         from './modules/dashboard/component/dashboard.component';
import { DMXTesterComponent }         from './modules/DMX_tester/component/dmx.tester.component';
import { FixturesPageComponent }      from './modules/fixture/component/page/fixtures.page.component';


/**
 * Routes for the chunk parts
 * 
 */
const routes: Routes = 
[
	// Dashboard
	{ path: '', 					        redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard',  				component: DashboardComponent },
  { path: 'DMXTester',  				component: DMXTesterComponent },
  { path: 'fixtures',  				  component: FixturesPageComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})






export class AppRoutingModule 
{
  
}
