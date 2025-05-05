<?php

class UserController {
	private string $filePath;

	public function __construct(string $filePath)
	{
		$this->filePath = $filePath;
	}

	private function readUsers(): array {
		return file_exists($this->filePath) 
			? json_decode(file_get_contents($this->filePath), true) ?? [] 
			: [];
	}

	private function saveUsers(array $users): void {
		file_put_contents($this->filePath, json_encode($users, JSON_PRETTY_PRINT));
	}

	// Liste tous les utilisateurs
	public function listUsers(): void {
		echo json_encode($this->readUsers());
	}

	// Change les rôles d’un utilisateur
	public function updateUserRoles(string $email, array $roles): void {
		$users = $this->readUsers();

		if (!isset($users[$email])) {
			http_response_code(404);
			echo json_encode(["error" => "Utilisateur introuvable"]);
			return;
		}

		$users[$email]['roles'] = $roles;
		$this->saveUsers($users);

		http_response_code(200);
		echo json_encode(["success" => true]);
	}

	// Liste des utilisateurs ayant fait une demande de rôle
	public function getRoleRequests(): void {
		$users = $this->readUsers();
		$requests = [];

		foreach ($users as $email => $user) {
			if (in_array('DemandeChef', $user['roles']) || in_array('DemandeTraducteur', $user['roles'])) {
				$requests[$email] = $user;
			}
		}

		echo json_encode($requests);
	}
}