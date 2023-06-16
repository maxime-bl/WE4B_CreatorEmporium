import { Injectable } from '@angular/core';
import DatabaseService from './database.service';
import { Storage, UploadMetadata, UploadResult, getDownloadURL, getStorage, ref, uploadBytes } from '@angular/fire/storage';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  storage: Storage;

  constructor(private firebaseService: FirebaseService) {
    this.storage = getStorage(firebaseService.getApp())
  }

  async uploadProductImage(id: string, image: File) : Promise<string>{
    const imageRef = ref(this.storage, 'productImages/' + id + '.' + image.type.split('/')[1])
    await uploadBytes(imageRef, image);
    return await getDownloadURL(imageRef);
  }
}
