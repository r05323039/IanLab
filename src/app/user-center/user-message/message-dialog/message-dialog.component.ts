import {Component, EventEmitter, Inject, Input, Output} from '@angular/core';
import {MessageModel} from "../../../pojo/message.model";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.css']
})
export class MessageDialogComponent {
  @Input() msg: MessageModel
  @Output() confirmClicked = new EventEmitter();
  @Output() deleteClicked = new EventEmitter();

  confirm() {
    this.confirmClicked.emit();
  }

  delete() {
    this.deleteClicked.emit();
  }

}
