import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

let activeDialog = null;
let nextDialogId = 0;
const listeners = new Set();

const publishDialog = (dialog) => {
  activeDialog = dialog;
  listeners.forEach((listener) => listener(dialog));
};

const dismissDialog = (id) => {
  if (!activeDialog || activeDialog.id !== id) return;
  publishDialog(null);
};

export const Alert = {
  alert(title, message, buttons) {
    const actions = Array.isArray(buttons) && buttons.length > 0
      ? buttons
      : [{ text: 'OK' }];

    publishDialog({
      id: ++nextDialogId,
      title: title == null ? '' : String(title),
      message: message == null ? '' : String(message),
      buttons: actions,
    });
  },
};

export function AppDialogHost() {
  const [dialog, setDialog] = useState(activeDialog);

  useEffect(() => {
    listeners.add(setDialog);
    setDialog(activeDialog);
    return () => listeners.delete(setDialog);
  }, []);

  const close = () => {
    if (dialog) dismissDialog(dialog.id);
  };

  return (
    <Modal
      transparent
      visible={Boolean(dialog)}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={close}
    >
      {dialog ? (
        <View style={styles.overlay}>
          <View
            style={styles.dialog}
            accessibilityRole="alert"
            accessibilityViewIsModal
          >
            <View style={styles.heading}>
              <Ionicons name="information-circle" size={24} color="#FFD700" />
              {dialog.title ? <Text style={styles.title}>{dialog.title}</Text> : null}
            </View>
            {dialog.message ? <Text style={styles.message}>{dialog.message}</Text> : null}
            <View
              style={[
                styles.actions,
                dialog.buttons.length > 1 && dialog.buttons.length <= 2
                  ? styles.horizontalActions
                  : null,
              ]}
            >
              {dialog.buttons.map((button, index) => {
                const buttonStyle = button.style === 'cancel'
                  ? styles.cancelButton
                  : button.style === 'destructive'
                    ? styles.destructiveButton
                    : styles.primaryButton;
                const labelStyle = button.style === 'cancel'
                  ? styles.cancelLabel
                  : styles.primaryLabel;

                return (
                  <Pressable
                    key={`${button.text || 'OK'}-${index}`}
                    style={[
                      styles.button,
                      buttonStyle,
                      dialog.buttons.length > 1 && dialog.buttons.length <= 2
                        ? styles.flexButton
                        : null,
                    ]}
                    onPress={() => {
                      close();
                      if (typeof button.onPress === 'function') button.onPress();
                    }}
                    accessibilityRole="button"
                  >
                    <Text style={labelStyle}>{button.text || 'OK'}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      ) : null}
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(5, 10, 20, 0.72)',
  },
  dialog: {
    width: '100%',
    maxWidth: 420,
    padding: 22,
    borderWidth: 1,
    borderColor: '#344155',
    borderRadius: 18,
    backgroundColor: '#1A1F2E',
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  title: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  message: {
    color: '#D1D5DB',
    fontSize: 15,
    lineHeight: 22,
  },
  actions: {
    gap: 10,
    marginTop: 22,
  },
  horizontalActions: {
    flexDirection: 'row',
  },
  button: {
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingHorizontal: 16,
  },
  flexButton: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: '#FFD700',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#64748B',
    backgroundColor: '#252D3D',
  },
  destructiveButton: {
    backgroundColor: '#B42318',
  },
  primaryLabel: {
    color: '#141E30',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  cancelLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
