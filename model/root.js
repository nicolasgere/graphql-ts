"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const index_1 = require('./../graphql-ts/index');
const voiture_1 = require('./voiture');
//something i dont like
var t = new voiture_1.voiture();
class root {
    voitures() {
        var voiture1 = new voiture_1.voiture();
        voiture1.model = "clio";
        voiture1.annee = 1232;
        var list = [];
        list.push(voiture1);
        return list;
    }
    ;
}
__decorate([
    index_1.field, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', []), 
    __metadata('design:returntype', Array)
], root.prototype, "voitures", null);
exports.root = root;
