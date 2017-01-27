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
const distributeur_1 = require('./distributeur');
var db = "yahou";
class voiture {
    distributeurs() {
        return ['jolw', 'quetal'];
    }
    test() {
        return { name: "blabla", ville: "tarbes" };
    }
    hello() {
        return "hello world";
    }
    add_distributeur(test) {
        return ['test'];
    }
}
__decorate([
    index_1.field, 
    __metadata('design:type', String)
], voiture.prototype, "model", void 0);
__decorate([
    index_1.field, 
    __metadata('design:type', Number)
], voiture.prototype, "annee", void 0);
__decorate([
    index_1.field,
    index_1.required(['name']),
    index_1.returnType('string'), 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', []), 
    __metadata('design:returntype', Array)
], voiture.prototype, "distributeurs", null);
__decorate([
    index_1.field, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', []), 
    __metadata('design:returntype', distributeur_1.distributeur)
], voiture.prototype, "test", null);
__decorate([
    index_1.field, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', []), 
    __metadata('design:returntype', String)
], voiture.prototype, "hello", null);
__decorate([
    index_1.mutation,
    index_1.returnType('string'), 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [distributeur_1.distributeurInput]), 
    __metadata('design:returntype', Array)
], voiture.prototype, "add_distributeur", null);
exports.voiture = voiture;
