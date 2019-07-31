import { Component, Input } from '@angular/core';
import { Order, Quote, Note, NoteService } from '@apttus/ecommerce';

/**
 * Comments component is a way to show and add comments.
 *  @example
 * <app-comments
 * [item] = 'Order | Quote'
 * ></app-comments>
 */
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent {

  @Input() item: Order | Quote;
  comments: any = null;
  parentId: string = null;
  commentBody: string = null;

  constructor(private noteService: NoteService) { }

  ngOnChanges() {
    if (!this.item) {
      return;
    }
    if (this.item instanceof Quote) {
      this.comments = this.item.Notes;
      this.parentId = this.item.Id;
    }
  }

  /**
   * @ignore
   */
  onChange(event): void {
    this.commentBody = event.target.value;
  }

  /**
   * @ignore
   */
  onAddComment(): void {
    let note = new Note(),
      title = 'sample title';
    note.Body = this.commentBody;
    // this.noteService.addNote(note, this.parentId, title)
    //   .take(1)
    //   .subscribe(res => {
    //     console.log(res);
    //   }, err => {
    //     console.log(err);
    //   });
  }

}
