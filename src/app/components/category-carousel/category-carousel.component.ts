import { Component, OnInit } from '@angular/core';
import { Category, CategoryService } from '@apttus/ecommerce';
import { map } from 'rxjs/operators';
import { map as _map, set } from 'lodash';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category-carousel',
  templateUrl: './category-carousel.component.html',
  styleUrls: ['./category-carousel.component.scss']
})
export class CategoryCarouselComponent implements OnInit {


  index: number = 0;
  view$: Observable<CategoryView>;

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {

    this.view$ = this.categoryService.getCategoryTree()
      .pipe(
        map(categoryTree => {
          return {
            categoryTree: categoryTree,
            categoryBranch: _map(categoryTree, (c) => {
              const depth = this.getDepth(c);
              return new Array<any>(depth);
            })
          };
        })
      )
  }

  getDepth(obj) {
    let depth = 0;
    if (obj.Children) {
      obj.Children.forEach(d => {
        const tmpDepth = this.getDepth(d);
        if (tmpDepth > depth) {
          depth = tmpDepth;
        }
      });
    }
    return 1 + depth;
  }

  goToCategory(category: Category, view: CategoryView){
    set(view, `categoryBranch[${this.index}]`, category);
    this.index += 1;
  }

  goBack(view: CategoryView){
    set(view, `categoryBranch[${this.index}]`, new Category());
    this.index -= 1;
    this.index = (this.index < 0) ? 0 : this.index;
  }
}

interface CategoryView{
  categoryTree: Array<Category>;
  categoryBranch: Array<Category>;
}
