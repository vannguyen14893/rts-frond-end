import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { BaseService } from '../../core/services/base.service';
import { Cv } from '../../model/cv.class';
import { API_URL } from '../../shared/constants/api.constant';

@Injectable()
export class CvService extends BaseService {

    urlCvApi = environment.baseUrl + API_URL.API_CV;
    urlImage = environment.baseUrl + API_URL.UPLOAD_IMAGE;
    urlDoc = environment.baseUrl + API_URL.UPLOAD_DOC;
    allSkillUrl = environment.baseUrl + API_URL.GET_ALL_SKILLS;
    allExperienceUrl = environment.baseUrl + API_URL.GET_ALL_EXPERIENCES;
    checkContactUrl = environment.baseUrl + API_URL.CHECK_CONTACT;
    listRequestAccept = environment.baseUrl + API_URL.GET_ALL_REQUESTS_ACCEPT;
    listCvStatus = environment.baseUrl + API_URL.GET_ALL_CV_STATUS;

    checkFileExistenceUrl = environment.baseUrl + API_URL.UPLOAD_CHECK;
    getOneCvUrl = environment.baseUrl + API_URL.GET_ONE_CV;
    private findCvUsedToMakeCandidateUrl = environment.baseUrl + API_URL.FIND_CV_USED_TO_MAKE_CANDIDATE;
    historyMakeUrl = environment.baseUrl + API_URL.HISTORY_MAKE_BY_CV;
    private makeCandidateUrl = environment.baseUrl + API_URL.MAKE_CANDIDATE;
    private makeCandidateUrl2 = environment.baseUrl + API_URL.MAKE_CANDIDATE2;
    findAssignedRequestsBelongAssigneeUrl = environment.baseUrl + API_URL.FIND_ASSIGNED_REQUESTS_BELONG_ASSGNEE;

    // To store selected cv on cv list page and display on detail page
    cv: Cv;

    constructor(httpClient: HttpClient) {
        super(httpClient);
    }
    checkContact(params: {}) {
        return this.httpClient.get(this.checkContactUrl, {
            params,
            headers: this.createHeaders(),
            responseType: 'text'
        });
    }
    // Check if avatar or cv docs exist on server
    checkFileExistence(fileNames: string[]) {
        return this.post(this.checkFileExistenceUrl, fileNames);
    }

    getAll(params: {}): Observable<any> {
        return this.get(this.urlCvApi, params);
    }

    getAllSkills(): Observable<any> {
        return this.get(this.allSkillUrl);
    }

    getAllRequestAccept(params): Observable<any> {
        return this.get(this.listRequestAccept, params);
    }

    getStatusCv(): Observable<any> {
        return this.get(this.listCvStatus);
    }

    getAllExperience(): Observable<any> {
        return this.get(this.allExperienceUrl);
    }

    createCv(data): Observable<any> {
        return this.post(this.urlCvApi, data);
    }
    updateCv(data: Cv): Observable<any> {
        return this.put(this.urlCvApi, data, 'text');
    }

    uploadCVFiles(files: File[]): Observable<any> {
        const formData = new FormData();
        for (const file of files) {
            formData.append('doc', file);
        }
        return this.post(this.urlDoc, formData);
    }

    uploadAvatar(file: File[]): Observable<any> {
        const formData = new FormData();
        formData.append('image', file[0]);
        return this.post(this.urlImage, formData);
    }

    getOne(cvId: number) {
        return this.get(this.getOneCvUrl + '/' + cvId);
    }

    findCvUsedToMakeCandidate(params: {}) {
        return this.get(this.findCvUsedToMakeCandidateUrl, params);
    }

    getHistoryMakeCandidateByCv(id): Observable<any> {
        return this.get(this.historyMakeUrl, {
            cvId: id
        });
    }

    makeCandidate(data) {
        return this.post(this.makeCandidateUrl, data);
    }

    viewFileCv(path: string) {
        // return this.httpClient.get(environment.baseUrl + '/resources/public/' + path, {
        //     headers: this.createHeaders(),
        //     responseType: 'text'
        // });
        window.open(environment.baseUrl + '/public/' + path);
    }

    makeCandidate2(params): Observable<any> {
        return this.get(this.makeCandidateUrl2, params);
    }
    findAssignedRequestsBelongAssignee(): Observable<any> {
        return this.get(this.findAssignedRequestsBelongAssigneeUrl);
    }

}
