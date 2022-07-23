import React, { useState, useEffect } from 'react';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  isPlatform,
  IonCheckbox,
  IonRadioGroup,
  IonListHeader,
  IonRadio
} from '@ionic/react';
import './Tab1.css';
import { useVault } from '../hooks/useVault';
import { Device } from '@ionic-enterprise/identity-vault';

const isMobile = isPlatform('hybrid');

const Tab1: React.FC = () => {
  const { 
    session, 
    storeSession, 
    restoreSession, 
    lockVault, 
    unlockVault,
    vaultIsLocked,
    lockType,
    setLockType,
    vaultExists,
    clearVault
  } = useVault();
  const [data, setData] = useState<string>('');
  const [privacyScreen, setPrivacyScreen] = useState<boolean>(false);
  const [canUseSystemPin, setCanUseSystemPin] = useState<boolean>(false);
  const [canUseBiometrics, setCanUseBiometrics] = useState<boolean>(false);

  useEffect(() => {
    if (isMobile) {
      Device.isSystemPasscodeSet().then(setCanUseSystemPin);
      Device.isBiometricsEnabled().then(setCanUseBiometrics);
      Device.isHideScreenOnBackgroundEnabled().then(setPrivacyScreen);
    }
  }, []);

  useEffect(() => {
    if (isMobile) 
      Device.setHideScreenOnBackground(privacyScreen);
  }, [privacyScreen]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Identity Vault Test</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Identity Vault</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList>
          <IonItem>
            <IonLabel position="floating">Enter the "session" data</IonLabel>
            <IonInput
              value={data}
              onIonChange={e => setData(e.detail.value!)}
            />
          </IonItem>

          <IonItem>
            <div style={{ flex: 'auto' }}>
              <IonButton expand="block" onClick={() => storeSession(data)}>
                Set Session Data
              </IonButton>
            </div>
          </IonItem>

          <IonItem>
            <div style={{ flex: 'auto' }}>
              <IonButton expand="block" onClick={restoreSession}>
                Restore Session Data
              </IonButton>
            </div>
          </IonItem>

          <IonItem>
            <IonLabel>
              <div>Session Data: {session}</div>
              <div>Vault is Locked: {vaultIsLocked.toString()}</div>
              <div>Vault Exists: {vaultExists}</div>
            </IonLabel>
          </IonItem>

          <IonItem>
            <div style={{ flex: 'auto' }}>
              <IonButton expand="block" onClick={lockVault}>
                Lock Vault
              </IonButton>
            </div>
          </IonItem>

          <IonItem>
            <div style={{ flex: 'auto' }}>
              <IonButton expand="block" onClick={unlockVault}>
                Unlock Vault
              </IonButton>
            </div>
          </IonItem>

          <IonItem>
            <IonLabel>Use Privacy Screen</IonLabel>
            <IonCheckbox
              disabled={!isMobile}
              checked={privacyScreen}
              onIonChange={e => setPrivacyScreen(e.detail.checked!)}
            />
          </IonItem>
        </IonList>
        <IonRadioGroup
          value={lockType}
          onIonChange={e => setLockType(e.detail.value!)}
        >
          <IonListHeader>
            <IonLabel>Vault Locking Mechanism</IonLabel>
          </IonListHeader>
          <IonItem>
            <IonLabel>Do Not Lock</IonLabel>
            <IonRadio value="NoLocking" />
          </IonItem>
          <IonItem>
            <IonLabel>Use Biometrics</IonLabel>
            <IonRadio disabled={!canUseBiometrics} value="Biometrics" />
          </IonItem>
          <IonItem>
            <IonLabel>Use System Passcode</IonLabel>
            <IonRadio disabled={!canUseSystemPin} value="SystemPasscode" />
          </IonItem>
        </IonRadioGroup>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
