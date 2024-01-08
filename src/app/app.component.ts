import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonEnums } from './Enums/common-enums';
import { DocumentService } from './services/document.service'; 
import { Department } from './Models/Department';
import { Document } from './Models/Document';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  CommonEnums = CommonEnums;
  form!: FormGroup;
  formSubmitted = false;
  departments: Department[] = [];
  documents: Document[] = [];
  document: Document = { Id: 0, DepartmentId: 0, DepartmentName: '', DocumentName: '' };
  AlreadyExistmessage = '';
  SuccessfullyAddedMessage = '';
  ModalExistedMessage='';
  ModalSuccessMessage = '';

  constructor(private http: HttpClient, private fb: FormBuilder, private documentService: DocumentService) { }

  ngOnInit(): void {
      this.form = this.fb.group({
        department: ['', Validators.required],
        documentName: ['', Validators.required]
      });
      this.fetchData(); 
  }

  fetchData(): void {
    try {
      this.documentService.getDepartments().subscribe({
        next: departments => {
          this.departments = departments;
        },
        error: error => {
          console.error('Error fetching departments:', error);
        }
    });

      this.documentService.getDocuments().subscribe({
        next: documents => {
          console.log(documents);
          this.documents = documents;
        },
        error: error => {
          console.error('Error fetching documents:', error);
        }
    });
    } catch (error) {
      console.error('Error in fetchData:', error);
    }
  }

  addDocument(): void {
    try {
      this.AlreadyExistmessage = '';
      this.SuccessfullyAddedMessage = '';
      this.formSubmitted = true;

      if (this.form.valid) {
        const selectedDepartment = this.departments.find(dep => dep.Id === +this.form.value.department);

        const documentData = {
          id: 0,
          departmentId: selectedDepartment ? selectedDepartment.Id : 0,
          departmentName: selectedDepartment ? selectedDepartment.DepartmentName : '',
          documentName: this.form.value.documentName
        };

        if(this.documents.find(i => i.DepartmentName == documentData.departmentName && i.DocumentName == documentData.documentName)) {
          this.AlreadyExistmessage = CommonEnums.DocumentAlreadyExistsMessage;
          return;
        }

        this.documentService.addDocument(documentData).subscribe({
          next: () => {
            this.fetchData();
            this.resetForm();
            this.SuccessfullyAddedMessage = CommonEnums.DocumentAddedSuccessfullyMessage;
            this.AlreadyExistmessage = '';
          },
          error: error => {
              this.AlreadyExistmessage = CommonEnums.DocumentAlreadyExistsMessage;
              this.SuccessfullyAddedMessage = '';
          }
      });
      }
      
    } catch (error) {
      console.error('Error in addDocument:', error);
    }
  }

  resetForm(): void {
    try {
      this.formSubmitted = false;
      this.ModalExistedMessage = '';
      this.ModalSuccessMessage = '';
      this.AlreadyExistmessage='';
      this.SuccessfullyAddedMessage='';
      this.form.reset();
    } catch (error) {
      console.error('Error in resetForm:', error);
    }
  }

  openEditModal(document: Document): void {
    try {
      this.document = { ...document };
      const selectedDepartmentName=this.document.DepartmentName || ''
      const documentName = this.document.DocumentName || '';
      const selectedDepartment = this.departments.find(dep => dep.DepartmentName === selectedDepartmentName);
      this.form.get('department')?.setValue(selectedDepartment ? selectedDepartment.Id : '');
      this.form.get('documentName')?.setValue(documentName);
      this.ModalExistedMessage = '';
      this.ModalSuccessMessage = '';
      this.AlreadyExistmessage='';
      this.SuccessfullyAddedMessage='';
    } catch (error) {
      console.error('Error in openEditModal:', error);
    }
  }

  onDepartmentChange(event: any): void {
    try {
      const selectedDepartmentId = event.target.value;
      this.form.get('department')?.setValue(selectedDepartmentId);
    } catch (error) {
      console.error('Error in onDepartmentChange:', error);
    }
  }

  closeModal(): void {
    try {
      this.ModalExistedMessage = '';
      this.ModalSuccessMessage = '';
      this.AlreadyExistmessage='';
      this.SuccessfullyAddedMessage='';
      this.form.reset();
    } catch (error) {
      console.error('Error in closeModal:', error);
    }
  }

  saveChanges(): void {  
    try {
      const selectedDepartment = this.departments.find(dep => dep.Id === +this.form.value.department);
  
      if (selectedDepartment) {
        const updatedDocument = {
          id: this.document.Id,
          departmentId: selectedDepartment.Id,
          documentName: this.form.value.documentName
        };
  
        if (
          this.documents.find(
            i => i.DepartmentName === selectedDepartment.DepartmentName && i.DocumentName === updatedDocument.documentName
          )
        ) {
          this.ModalExistedMessage = CommonEnums.DocumentAlreadyExistsMessage;
          this.ModalSuccessMessage = '';
          return;
        }
  
        this.documentService.updateDocument(updatedDocument).subscribe({
          next: () => {
            this.fetchData();
            this.closeModal();
            this.ModalSuccessMessage = CommonEnums.SuccessfullyModifiedModalMessage;
            this.ModalExistedMessage = '';
          },
          error: error => {
            console.error('Error updating document:', error);
          }
        });
      }
    } catch (error) {
      console.error('Error in saveChanges:', error);
    }
  }
  
}
