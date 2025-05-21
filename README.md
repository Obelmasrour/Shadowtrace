# ShadowTrace — Scanner de Sécurité Web

**ShadowTrace** est un scanner de vulnérabilités moderne permettant d’analyser automatiquement les failles de sécurité dans les applications web. Il s’appuie sur l’outil **OWASP ZAP** et fournit une interface réactive et intuitive pour visualiser les résultats et générer un rapport PDF personnalisé.

---

## Fonctionnalités principales

* Scan de sites web via OWASP ZAP
* Vérification DNS TXT avant scan pour assurer l’autorisation
* Interface frontend moderne (React + Tailwind)
* Mode clair / sombre
* Rapport PDF coloré exportable
* Traduction multilingue (FR / EN)

---

## Objectif du projet

Ce projet a été conçu pour simuler une plateforme de test d’injection de vulnérabilités. L'utilisateur peut scanner une URL de site web, voir les vulnérabilités détectées, puis générer un rapport PDF. Une vérification par **DNS TXT** est obligatoire pour valider que l'utilisateur possède le domaine.

---

## Lancer l'application

### 1. Prérequis

* Node.js v18+
* npm
* OWASP ZAP installé en mode **daemon**

### 2. Installation

```bash
git clone https://github.com/Obelmasrour/Shadowtrace.git
cd Shadowtrace
```

Créer un fichier `.env` dans `/main` :

```env
ZAP_API_KEY=ta-cle-api-zap
ZAP_API_URL=http://localhost:8081
```

> Tu peux récupérer la clé ZAP dans `Options > API > Clé d'API`

### 3. Lancer ZAP en daemon

```bash
# Windows :
"C:\\Program Files\\OWASP\\Zed Attack Proxy\\zap.bat" -daemon

# ou via Docker :
docker run -u zap -p 8081:8080 -i owasp/zap2docker-stable zap.sh -daemon -port 8080 -config api.disablekey=false
```

### 4. Lancer le backend

```bash
cd main
npm install
node server.js
```

Serveur sur `http://localhost:5000`

### 5. Lancer le frontend

```bash
cd ../shadowtrace-ui
npm install
npm run dev
```

Application sur `http://localhost:3000`

---

## Vérification DNS

Avant de scanner un site **non-localhost**, vous devez prouver que vous en êtes propriétaire en ajoutant une entrée DNS :

```
Type : TXT
Nom  : monsite.com
Valeur : shadowtrace-verification=shadowtrace-localkey-123
```

Sans cette vérification, le scan retournera une erreur 403.

---

## Génération du rapport

Une fois le scan terminé, cliquez sur **"Generate PDF Report"** :

* Rapport généré dynamiquement avec `PDFKit`
* Score et couleur selon risque (rouge / orange / vert)
* Description + solution recommandée

---

## Technologies utilisées

* **Node.js** / Express.js
* **React.js** (frontend)
* **TailwindCSS** (style)
* **PDFKit** pour les exports PDF
* **DNS.promises** pour la vérification DNS
* **OWASP ZAP API** pour lancer les scans

---

## Auteurs & Encadrement

Projet réalisé par :

* Ossama BELMASROUR
* Yahya MICHBAL 


---

## Capture d’écran

![image](https://github.com/user-attachments/assets/327560cb-1b68-4e64-86be-0bfc0788128e)
![image](https://github.com/user-attachments/assets/fd468bb7-708a-438e-9da5-316932d6da16)
![image](https://github.com/user-attachments/assets/46f3cd90-e1c9-4bb1-9139-92be12f0977c)


---

## Avertissement

**ShadowTrace** est un outil pédagogique à but non malveillant. Le scan de domaines tiers sans autorisation explicite est interdit.

---

