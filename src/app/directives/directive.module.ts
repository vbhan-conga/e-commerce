import { NgModule } from '@angular/core';
import { AutoFocusDirective } from './auto-focus.directive';
/**
 * Module for all directives across the application.
 */
@NgModule({
  declarations: [AutoFocusDirective],
  exports: [AutoFocusDirective]
})
export class DirectivesModule {}